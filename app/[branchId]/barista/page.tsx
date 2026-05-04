import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BaristaUI from '@/app/components/BaristaUI';

export default async function BaristaPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  const branch = await prisma.branch.findUnique({
    where: { id: branchId }
  });

  if (!branch) {
    notFound();
  }

  return <BaristaUI branch={branch} />;
}
