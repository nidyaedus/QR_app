'use server';

import { prisma } from '@/lib/prisma';
import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || '',
  secretKey: process.env.IYZICO_SECRET_KEY || '',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

export async function processCheckout(data: {
  branchId: string;
  name: string;
  phone: string;
  cart: { productId: string; quantity: number }[];
  totalAmount: number;
}) {
  try {
    // 1. Find or Create User
    let user = await prisma.user.findUnique({ where: { phone: data.phone } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { name: data.name, phone: data.phone, stampCount: 0 }
      });
    }

    // 2. Check for free coffee (Assuming 10 stamps = 1 free coffee of 50 TL value for simplification)
    let finalAmount = data.totalAmount;
    let stampsUsed = false;

    if (user.stampCount >= 10) {
      finalAmount = Math.max(0, finalAmount - 50); // Discount 50 TL
      stampsUsed = true;
    }

    // 3. Make the API Call to Iyzico
    console.log("Final Amount:", finalAmount);
    if (finalAmount > 0) {
      console.log("Iyzico API Key:", process.env.IYZICO_API_KEY?.substring(0, 10) + "...");
      const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: 'COFFY' + Date.now(),
        price: finalAmount.toString(),
        paidPrice: finalAmount.toString(),
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B' + Date.now(),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: data.name,
            cardNumber: '4353000000000000', // Master Test Karti
            expireMonth: '12',
            expireYear: '2026',
            cvc: '123',
            registerCard: '0'
        },
        buyer: {
            id: user.id || "BY123",
            name: data.name.split(' ')[0] || "Deneme",
            surname: data.name.split(' ').slice(1).join(' ') || "Kullanici",
            gsmNumber: "+90" + data.phone,
            email: "test@coffy.com",
            identityNumber: "11111111111",
            lastLoginDate: "2023-10-05 12:43:35",
            registrationDate: "2023-04-21 15:12:09",
            registrationAddress: "Atasehir",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: data.name,
            city: "Istanbul",
            country: "Turkey",
            address: "Sube Teslimati",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: data.name,
            city: "Istanbul",
            country: "Turkey",
            address: "Sube Teslimati",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Coffy Siparis',
                category1: 'Yiyecek Içecek',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: finalAmount.toString()
            }
        ]
      };

      console.log("Iyzico Request:", JSON.stringify(request, null, 2));
      const iyzicoResult: any = await new Promise((resolve, reject) => {
        iyzipay.payment.create(request, function (err, res) {
          if (err) return reject(err);
          resolve(res);
        });
      });
      console.log("Iyzico Result Status:", iyzicoResult.status);
      console.log("Iyzico Result:", JSON.stringify(iyzicoResult, null, 2));

      if (iyzicoResult.status !== 'success') {
         console.error("Iyzico Hatasi:", iyzicoResult);
         throw new Error("Ödeme alınamadı: " + iyzicoResult.errorMessage);
      }
    }

    // 4. Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        branchId: data.branchId,
        totalAmount: finalAmount,
        status: 'RECEIVED',
        items: {
          create: data.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0 // Fetch real price locally in real app to prevent manipulation
          }))
        }
      }
    });

    // 4. Update Stamps
    // Add 1 stamp for this order. If they used 10 stamps, subtract 10.
    const newStampCount = stampsUsed ? (user.stampCount - 10 + 1) : (user.stampCount + 1);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { stampCount: newStampCount }
    });

    return { success: true, orderId: order.id, newStampCount };

  } catch (error) {
    console.error('Checkout error:', error);
    return { success: false, error: 'Checkout failed' };
  }
}
