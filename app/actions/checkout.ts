'use server';

import { prisma } from '@/lib/prisma';

type CartItemInput = {
  productId: string;
  quantity: number;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+90${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return `+90${digits.slice(1)}`;
  }

  if (digits.length === 12 && digits.startsWith('90')) {
    return `+${digits}`;
  }

  if (digits.length >= 10) {
    return `+${digits}`;
  }

  throw new Error('Telefon numarası geçersiz.');
}

function mergeCartItems(cart: CartItemInput[]) {
  const merged = new Map<string, number>();

  for (const item of cart) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error('Sepette geçersiz ürün var.');
    }

    merged.set(item.productId, (merged.get(item.productId) || 0) + item.quantity);
  }

  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStartOfTomorrow() {
  const date = getStartOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

function getOrderDateKey() {
  const date = getStartOfToday();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function createDailyOrderNumber(branchId: string) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { name: true }
  });

  if (!branch) {
    throw new Error('Şube bulunamadı.');
  }

  const branchCode =
    branch.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 2)
      .toUpperCase() || 'CF';

  const start = getStartOfToday();
  const end = getStartOfTomorrow();
  const orderDate = getOrderDateKey();
  let sequence = await prisma.order.count({
    where: {
      branchId,
      createdAt: {
        gte: start,
        lt: end
      }
    }
  });

  for (let attempt = 0; attempt < 10; attempt += 1) {
    sequence += 1;
    const orderNumber = `${branchCode}${String(sequence).padStart(3, '0')}`;
    const existing = await prisma.order.findFirst({
      where: { branchId, orderDate, orderNumber }
    });

    if (!existing) {
      return { orderNumber, orderDate };
    }
  }

  return { orderNumber: `${branchCode}${Date.now().toString().slice(-6)}`, orderDate };
}

export async function processCheckout(data: {
  branchId: string;
  name: string;
  phone: string;
  cart: CartItemInput[];
  totalAmount: number;
}) {
  try {
    const name = data.name.trim();
    const phone = normalizePhone(data.phone);
    const cart = mergeCartItems(data.cart);

    if (!name) {
      throw new Error('Ad soyad gereklidir.');
    }

    if (cart.length === 0) {
      throw new Error('Sepetiniz boş.');
    }

    const productIds = cart.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });
    const productMap = new Map(products.map(product => [product.id, product.price]));

    if (products.length !== cart.length) {
      throw new Error('Sepette geçersiz ürün var.');
    }

    const calculatedTotal = cart.reduce((total, item) => {
      const price = productMap.get(item.productId);
      if (price == null) {
        throw new Error('Sepette geçersiz ürün var.');
      }
      return total + price * item.quantity;
    }, 0);

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: { name, phone, stampCount: 0 }
      });
    } else if (user.name !== name) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name }
      });
    }

    let finalAmount = calculatedTotal;
    let stampsUsed = false;

    if (user.stampCount >= 10) {
      finalAmount = Math.max(0, finalAmount - 50);
      stampsUsed = true;
    }

    const { orderNumber, orderDate } = await createDailyOrderNumber(data.branchId);
    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderDate,
        userId: user.id,
        branchId: data.branchId,
        totalAmount: finalAmount,
        status: 'RECEIVED',
        paymentMethod: 'IN_STORE',
        paymentStatus: 'PAY_AT_COUNTER',
        items: {
          create: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId) || 0
          }))
        }
      }
    });

    const newStampCount = stampsUsed ? (user.stampCount - 10 + 1) : (user.stampCount + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: { stampCount: newStampCount }
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber,
      newStampCount,
      totalAmount: finalAmount
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('Checkout error:', errorMessage);

    return { success: false, error: errorMessage };
  }
}
