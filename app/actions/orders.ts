'use server';

import { prisma } from '@/lib/prisma';

export async function getActiveOrders(branchId: string) {
  return await prisma.order.findMany({
    where: {
      branchId,
      status: { in: ['RECEIVED', 'PREPARING', 'READY'] }
    },
    include: {
      items: {
        include: { product: true }
      },
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
