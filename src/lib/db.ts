import { prisma } from './prisma';

// Type-safe database operations
export const db = {
  user: {
    ...prisma.user
  },
  
  account: {
    ...prisma.account
  },
  
  session: {
    ...prisma.session
  },
  
  post: {
    ...prisma.post
  },
  
  comment: {
    ...prisma.comment
  },
  
  like: {
    ...prisma.like
  },
  
  follow: {
    ...prisma.follow
  },

  // Friend request operations
  friendRequest: {
    findMany: (args: any) => prisma.$queryRaw`
      SELECT * FROM "FriendRequest"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
    `,
    findFirst: (args: any) => prisma.$queryRaw`
      SELECT * FROM "FriendRequest"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
      LIMIT 1
    `,
    create: (args: any) => prisma.$queryRaw`
      INSERT INTO "FriendRequest" ("senderId", "receiverId", "status")
      VALUES (${args.data.senderId}, ${args.data.receiverId}, ${args.data.status || 'pending'})
      RETURNING *
    `,
    update: (args: any) => prisma.$queryRaw`
      UPDATE "FriendRequest"
      SET "status" = ${args.data.status}
      WHERE "id" = ${args.where.id}
      RETURNING *
    `
  },
  
  // Friend operations
  friend: {
    findMany: (args: any) => prisma.$queryRaw`
      SELECT * FROM "Friend"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
    `,
    findFirst: (args: any) => prisma.$queryRaw`
      SELECT * FROM "Friend"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
      LIMIT 1
    `,
    create: (args: any) => prisma.$queryRaw`
      INSERT INTO "Friend" ("userId", "friendId")
      VALUES (${args.data.userId}, ${args.data.friendId})
      RETURNING *
    `
  },
  
  // Transaction support
  $transaction: prisma.$transaction
};

// Helper function to build WHERE clauses
function buildWhereClause(where: any): string {
  if (where.OR) {
    return where.OR.map((condition: any) => buildWhereClause(condition)).join(' OR ');
  }
  
  const conditions = [];
  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR' || key === 'AND') continue;
    
    if (typeof value === 'object' && value !== null) {
      // Handle operators like 'in', 'not', etc.
      for (const [op, opValue] of Object.entries(value)) {
        if (op === 'in' && Array.isArray(opValue)) {
          conditions.push(`"${key}" IN (${opValue.map(v => `'${v}'`).join(', ')})`);
        } else if (op === 'not') {
          conditions.push(`"${key}" != '${opValue}'`);
        } else if (op === 'contains') {
          conditions.push(`"${key}" LIKE '%${opValue}%'`);
        } else if (op === 'startsWith') {
          conditions.push(`"${key}" LIKE '${opValue}%'`);
        }
      }
    } else {
      // Simple equality
      conditions.push(`"${key}" = '${value}'`);
    }
  }
  
  return conditions.join(' AND ');
} 