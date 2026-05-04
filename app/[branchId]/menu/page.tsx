import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MenuUI from '@/app/components/MenuUI';

export default async function MenuPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  const branch = await prisma.branch.findUnique({
    where: { id: branchId }
  });

  if (!branch) {
    notFound();
  }

  const products = await prisma.product.findMany();

  return <MenuUI branch={branch} products={products} />;
}
