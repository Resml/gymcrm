import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const passwordPlain = 'admin';
  const gymName = 'GymCRM HQ';

  const existing = await prisma.gymOwner.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists!');
    return;
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  
  await prisma.gymOwner.create({
    data: {
      email,
      passwordHash,
      gymName,
      plan: 'pro'
    }
  });

  console.log(`Successfully created admin user: ${email} / password: ${passwordPlain}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
