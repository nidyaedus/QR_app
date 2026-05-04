import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutUI from '@/app/components/CheckoutUI';

export default async function CheckoutPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  const branch = await prisma.branch.findUnique({
    where: { id: branchId }
  });

  if (!branch) {
    notFound();
  }

  return <CheckoutUI branch={branch} />;
}
