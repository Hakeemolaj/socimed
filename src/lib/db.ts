import { prisma } from './prisma';

// Define a basic WhereInput type for raw queries
// This is a simplified version and doesn't cover all Prisma WhereInput features
type BasicWhereInput = {
  [key: string]: string | number | boolean | { in?: (string | number)[]; not?: string | number; contains?: string; startsWith?: string };
  OR?: BasicWhereInput[];
  AND?: BasicWhereInput[];
};

type FindManyArgs = { where?: BasicWhereInput };
type FindFirstArgs = { where?: BasicWhereInput }; // Could also include orderBy, etc.

// Argument types for FriendRequest operations
interface FriendRequestCreateArgsData {
  senderId: string;
  receiverId: string;
  status?: string;
}
interface FriendRequestCreateArgs { data: FriendRequestCreateArgsData }

interface FriendRequestUpdateArgsData {
  status: string;
}
interface FriendRequestUpdateArgsWhere {
  id: string;
}
interface FriendRequestUpdateArgs { data: FriendRequestUpdateArgsData; where: FriendRequestUpdateArgsWhere }

// Argument types for Friend operations
interface FriendCreateArgsData {
  userId: string;
  friendId: string;
}
interface FriendCreateArgs { data: FriendCreateArgsData }

// Actual db object
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

  friendRequest: {
    findMany: (args: FindManyArgs) => prisma.$queryRaw`
      SELECT * FROM "FriendRequest"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
    `,
    findFirst: (args: FindFirstArgs) => prisma.$queryRaw`
      SELECT * FROM "FriendRequest"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
      LIMIT 1
    `,
    create: (args: FriendRequestCreateArgs) => prisma.$queryRaw`
      INSERT INTO "FriendRequest" ("senderId", "receiverId", "status")
      VALUES (${args.data.senderId}, ${args.data.receiverId}, ${args.data.status || 'pending'})
      RETURNING *
    `,
    update: (args: FriendRequestUpdateArgs) => prisma.$queryRaw`
      UPDATE "FriendRequest"
      SET "status" = ${args.data.status}
      WHERE "id" = ${args.where.id}
      RETURNING *
    `
  },
  
  friend: {
    findMany: (args: FindManyArgs) => prisma.$queryRaw`
      SELECT * FROM "Friend"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
    `,
    findFirst: (args: FindFirstArgs) => prisma.$queryRaw`
      SELECT * FROM "Friend"
      ${args.where ? `WHERE ${buildWhereClause(args.where)}` : ''}
      LIMIT 1
    `,
    create: (args: FriendCreateArgs) => prisma.$queryRaw`
      INSERT INTO "Friend" ("userId", "friendId")
      VALUES (${args.data.userId}, ${args.data.friendId})
      RETURNING *
    `
  },
  
  // Transaction support
  $transaction: prisma.$transaction
};

// Helper function to build WHERE clauses
function buildWhereClause(where: BasicWhereInput): string {
  if (where.OR) {
    return where.OR.map(condition => buildWhereClause(condition)).join(' OR ');
  }
  
  const conditions = [];
  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR' || key === 'AND') continue; // Handled by recursive calls or direct structure
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle operators like 'in', 'not', etc.
      // Ensure value is treated as a record for Object.entries
      const operatorRecord = value as Record<string, string | number | (string | number)[]>;
      for (const [op, opValue] of Object.entries(operatorRecord)) {
        if (op === 'in' && Array.isArray(opValue)) {
          conditions.push(`"${key}" IN (${opValue.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')})`);
        } else if (op === 'not') {
          conditions.push(`"${key}" != ${typeof opValue === 'string' ? `'${opValue}'` : opValue}`);
        } else if (op === 'contains' && typeof opValue === 'string') {
          conditions.push(`"${key}" LIKE '%${opValue}%'`);
        } else if (op === 'startsWith' && typeof opValue === 'string') {
          conditions.push(`"${key}" LIKE '${opValue}%'`);
        }
        // Add other operators as needed
      }
    } else if (typeof value === 'string') {
      conditions.push(`"${key}" = '${value}'`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      conditions.push(`"${key}" = ${value}`);
    }
  }
  
  return conditions.join(' AND ');
} 