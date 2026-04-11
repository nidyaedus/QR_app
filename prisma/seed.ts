import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();

  // Create Branches
  const b1 = await prisma.branch.create({
    data: { name: 'Kadıköy Moda Şubesi', address: 'Moda Cd. No: 1' }
  });
  const b2 = await prisma.branch.create({
    data: { name: 'Beşiktaş Çarşı Şubesi', address: 'Ihlamurdere Cd. No: 12' }
  });

  // Create Products
  const coffees = [
    { name: 'Filtre Kahve', description: 'Taze demlenmiş Arabica', price: 50, category: 'Coffee' },
    { name: 'Latte', description: 'Espresso ve sıcak süt', price: 70, category: 'Coffee' },
    { name: 'Flat White', description: 'Yoğun espresso ve ince krema', price: 75, category: 'Coffee' },
    { name: 'Cold Brew', description: '12 saat demlenmiş soğuk kahve', price: 80, category: 'Cold Brew' },
    { name: 'Iced Latte', description: 'Buzlu latte', price: 75, category: 'Cold Brew' },
  ];

  const snacks = [
    { name: 'Çikolatalı Kurabiye', description: 'Damla çikolatalı', price: 40, category: 'Snacks' },
    { name: 'Havuçlu Kek', description: 'Cevizli ve tarçınlı', price: 55, category: 'Snacks' },
  ];

  for (const c of coffees) {
    await prisma.product.create({ data: c });
  }
  for (const s of snacks) {
    await prisma.product.create({ data: s });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
