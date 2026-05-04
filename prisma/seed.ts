import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Filtre Kahve',
    description: 'Taze demlenmiş Arabica çekirdekleriyle günlük demleme.',
    price: 50,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Latte',
    description: 'Espresso, buharda süt ve yumuşak süt köpüğü.',
    price: 70,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1744296357005-817be7239f36?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Flat White',
    description: 'Yoğun espresso ve ince dokulu mikro köpük.',
    price: 75,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1643245253892-11f9af8a7306?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cappuccino',
    description: 'Espresso, sıcak süt ve bol köpüklü klasik fincan.',
    price: 72,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1553531152-e0757d8c0e92?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mocha',
    description: 'Espresso, kakao, süt ve hafif çikolata dokunuşu.',
    price: 82,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1765610866295-742a344dc606?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Americano',
    description: 'Espresso üzerine sıcak su ile sade ve dengeli kahve.',
    price: 60,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Cold Brew',
    description: '12 saat soğuk demlenmiş, düşük asiditeli kahve.',
    price: 80,
    category: 'Cold Brew',
    imageUrl: 'https://images.unsplash.com/photo-1581996323441-538096e854b9?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Iced Latte',
    description: 'Buz, espresso ve soğuk süt ile ferah latte.',
    price: 75,
    category: 'Cold Brew',
    imageUrl: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Iced Americano',
    description: 'Buzlu su üzerinde çift shot espresso.',
    price: 68,
    category: 'Cold Brew',
    imageUrl: 'https://images.unsplash.com/photo-1765690835487-8da60d318d0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Vanilyalı Cold Brew',
    description: 'Cold brew, vanilya aroması ve buzla servis edilir.',
    price: 88,
    category: 'Cold Brew',
    imageUrl: 'https://images.unsplash.com/photo-1759259639354-830bc3120807?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Matcha Latte',
    description: 'Japon matcha, süt ve yumuşak bitkisel aroma.',
    price: 90,
    category: 'Tea',
    imageUrl: 'https://images.unsplash.com/photo-1768203630324-4a456ef7148f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Chai Tea Latte',
    description: 'Baharatlı siyah çay, süt ve tarçın kokusu.',
    price: 78,
    category: 'Tea',
    imageUrl: 'https://images.unsplash.com/photo-1555251415-4716d9d0b8af?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Çikolatalı Kurabiye',
    description: 'Damla çikolatalı, dışı kıtır içi yumuşak kurabiye.',
    price: 40,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1519682214708-973477a2529a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Havuçlu Kek',
    description: 'Cevizli, tarçınlı ve kremalı dilim kek.',
    price: 55,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1676300186098-9b5ae9916e3c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'San Sebastian Cheesecake',
    description: 'Yanık yüzeyli, yoğun ve kremamsı cheesecake.',
    price: 95,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1759303380841-55c09244fd2b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kruvasan',
    description: 'Tereyağlı, kat kat ve günlük fırından.',
    price: 65,
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1747456909470-4e8433f208ea?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Bademli Kruvasan',
    description: 'Badem kremalı, pudra şekerli özel kruvasan.',
    price: 85,
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1759303380903-11154bc5d5bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tost Peynirli',
    description: 'Eritilmiş peynirli sıcak tost.',
    price: 70,
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1762647420988-5080acf33988?auto=format&fit=crop&w=600&q=80'
  }
];

async function main() {
  const branches = [
    { name: 'Kadıköy Moda Şubesi', address: 'Moda Cd. No: 1' },
    { name: 'Beşiktaş Çarşı Şubesi', address: 'Ihlamurdere Cd. No: 12' }
  ];

  for (const branch of branches) {
    const existing = await prisma.branch.findFirst({ where: { name: branch.name } });
    if (existing) {
      await prisma.branch.update({ where: { id: existing.id }, data: branch });
    } else {
      await prisma.branch.create({ data: branch });
    }
  }

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
