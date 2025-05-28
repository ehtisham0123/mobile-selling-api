import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const bcryptSaltRounds = 10;

// Function to hash passwords
async function hashPassword(password: string): Promise<string> {
  return hash(password, bcryptSaltRounds);
}

async function main() {
  console.log(
    'Seeding database with users, wallets, packages, and sponsors...',
  );

  function getRandomMultipleOf100(min: number, max: number): number {
    const multiples = [];
    for (let i = min; i <= max; i += 100) {
      multiples.push(i);
    }
    const randomIndex = Math.floor(Math.random() * multiples.length);
    return multiples[randomIndex];
  }

  const admin = await prisma.user.create({
    data: {
      id: '20c00fd4-84a5-4197-b880-27dbd27af098',
      firstName: 'dream',
      lastName: 'club',
      email: 'dreamclub263@gmail.com',
      password: await hashPassword('@Pakistan123'),
    },
  });

  const categories = [
    'Smartphones',
    'Tablets',
    'Smart Watches',
    'Earbuds',
    'Chargers',
    'Power Banks',
    'Phone Cases',
    'Screen Protectors',
    'Headphones',
    'Bluetooth Speakers',
    'Samsung',
    'Apple',
    'Xiaomi',
    'OnePlus',
    'Oppo',
  ];

  for (const name of categories) {
    await prisma.category.create({
      data: { name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
