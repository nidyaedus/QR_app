import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutUI from '@/app/components/CheckoutUI';

export default async function CheckoutPage({ params }: { params: { branchId: string } }) {
  const branch = await prisma.branch.findUnique({
    where: { id: params.branchId }
  });

  if (!branch) {
    notFound();
  }

  return <CheckoutUI branch={branch} />;
}
