import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar usuários de exemplo
  const user1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
    },
  });

  console.log('Users created:', { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
