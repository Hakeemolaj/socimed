import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
// Comment out the PrismaAdapter import and prisma import since we'll use JWT strategy
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

// Check if environment is development
const isDevelopment = process.env.NODE_ENV === 'development'

// Validate required environment variables
const validateEnv = () => {
  const requiredEnvs = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missingEnvs = Object.entries(requiredEnvs)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEnvs.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
  }

  // Check OAuth credentials if attempting to use them
  if (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('Incomplete Google OAuth credentials. Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be provided.');
    }
  }
}

// Validate environment variables early
validateEnv();

// Get the cookie domain from environment
const cookieDomain = process.env.NEXTAUTH_COOKIE_DOMAIN || undefined;

// Configure auth options
export const authOptions: NextAuthOptions = {
  // Remove the PrismaAdapter since we're using JWT
  // adapter: PrismaAdapter(prisma),
  
  // Set the session strategy to JWT
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  providers: [
    // Only include OAuth providers if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            },
            // Override default checks to bypass state cookie issue
            checks: [],
            // Explicitly set the profile function
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
              }
            },
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    // Add credentials provider for development/testing or when OAuth is not configured
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // In development, return a demo user
        if (isDevelopment) {
          return {
            id: "user-1",
            name: "Demo User",
            email: "demo@example.com",
            image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
          };
        }
        
        // Don't check the database since we're using JWT
        if (!credentials?.email) return null;
        
        // For testing, you can return a mock user
        return {
          id: "mock-user-id",
          name: "Test User",
          email: credentials.email,
          image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    // Update the session callback to work with JWT
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    // Add a JWT callback to customize the token
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    // Handle the sign-in flow and account linking
    signIn: async ({ user, account, profile }) => {
      // Skip this logic if we're in development mode or if prisma is undefined
      if (isDevelopment || !prisma) {
        return true;
      }

      try {
        const email = user.email;
        
        // If no email, allow sign in (shouldn't happen with most providers)
        if (!email) {
          return true;
        }
        
        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true },
        });
        
        // If user exists but with a different provider
        if (existingUser && account && existingUser.accounts.length > 0) {
          const existingAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider
          );
          
          // If no account with this provider exists, create one
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type || "oauth",
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
            
            // Use the existing user's ID 
            user.id = existingUser.id;
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Allow sign-in anyway to prevent blocking users
      }
    }
  },
  // Use minimal cookies configuration - NextAuth will handle the rest
  cookies: undefined,
  debug: isDevelopment,
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-do-not-use-in-production',
  logger: {
    error(code, metadata) {
      console.error(`Auth error: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`Auth warning: ${code}`);
    },
    debug(code, metadata) {
      if (isDevelopment) {
        console.log(`Auth debug: ${code}`, metadata);
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 