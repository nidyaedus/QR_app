import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BaristaUI from '@/app/components/BaristaUI';

export default async function BaristaPage({ params }: { params: { branchId: string } }) {
  const branch = await prisma.branch.findUnique({
    where: { id: params.branchId }
  });

  if (!branch) {
    notFound();
  }

  return <BaristaUI branch={branch} />;
}
