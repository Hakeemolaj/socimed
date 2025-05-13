// Simple database check utility script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  console.log('✓ Checking database connection...')
  
  try {
    // Simple query to verify database connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✓ Database connection successful!')
    return true
  } catch (error) {
    console.error('✗ Database connection failed!')
    console.error(error)
    
    console.log('\nPossible solutions:')
    console.log('1. Make sure PostgreSQL is running')
    console.log('2. Check your DATABASE_URL in .env file')
    console.log('3. Run `npx prisma db push` to create tables')
    console.log('4. Run `npx prisma generate` to update the Prisma client')
    return false
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseConnection()
  .then((success) => {
    if (!success) {
      process.exit(1)
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 