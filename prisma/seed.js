// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      image: 'https://via.placeholder.com/150',
      posts: {
        create: [
          {
            content: 'Hello world! This is my first post.',
            image: 'https://via.placeholder.com/500x300',
          },
          {
            content: 'I love building with Next.js and Prisma!',
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 