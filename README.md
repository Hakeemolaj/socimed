# Socimed - Social Media Platform

A full-featured social media platform built with Next.js, TypeScript, Prisma, and NextAuth.

## Features

- User authentication with NextAuth (Google, GitHub, and credentials)
- Friend requests and connections
- Posts with likes and comments
- Real-time notifications
- User profiles and search
- Dark/Light mode theme support
- Responsive design

## Recent Improvements

- **Real API Integration**: Updated components to use real API endpoints instead of mock data
- **Enhanced Authentication**: Improved NextAuth implementation with proper session handling
- **Theme Management**: Added proper context-based theme management with localStorage persistence
- **Optimized Queries**: Enhanced database queries for better performance
- **Error Handling**: Added comprehensive error handling throughout the application
- **Database Connection Checks**: Added utilities to verify database connectivity

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (local or hosted)

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/socimed.git
cd socimed
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your database URL and OAuth credentials
```

4. Set up the database
```bash
# Create and push the schema to the database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Verify database connection
node src/db-check.js
```

5. Run the development server
```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Production Deployment

### Database Setup

For production, consider using a managed database service like:
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [Planetscale](https://planetscale.com)
- [Neon](https://neon.tech)

Update your `DATABASE_URL` environment variable with your production database connection string.

### OAuth Configuration

For production, you must set up valid OAuth credentials:

1. Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project and set up OAuth credentials
   - Add authorized origins and redirect URIs for your production domain
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your production environment

2. GitHub OAuth:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth application
   - Add your production domain as the homepage URL
   - Set the callback URL to `https://yourdomain.com/api/auth/callback/github`
   - Update `GITHUB_ID` and `GITHUB_SECRET` in your production environment

### Step-by-Step Deployment Guide to Vercel

This project is optimized for deployment on Vercel. Follow these steps to deploy:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

2. **Connect to Vercel**:
   - Create an account on [Vercel](https://vercel.com)
   - Click "Add New..." and select "Project"
   - Import your GitHub repository
   - Select the "Next.js" framework preset

3. **Configure Environment Variables**:
   - In the Vercel project settings, navigate to the "Environment Variables" tab
   - Add the following environment variables:
     - `NEXTAUTH_SECRET`: A strong random string (use a password generator)
     - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://socimed.vercel.app)
     - `GOOGLE_CLIENT_ID`: Your production Google Client ID
     - `GOOGLE_CLIENT_SECRET`: Your production Google Client Secret
     - `DATABASE_URL`: Your production PostgreSQL database URL

4. **Configure Build Settings**:
   - In the "Settings" tab, under "Build & Development Settings"
   - Build Command: `npx prisma generate && next build`
   - Output Directory: `.next`

5. **Deploy**:
   - Click "Deploy" to start the deployment process
   - Vercel will build and deploy your application
   - Once complete, you can access your site at the provided URL

6. **Verify Deployment**:
   - Check that authentication works
   - Verify database connectivity
   - Test all main features

7. **Set Up Custom Domain (Optional)**:
   - In the Vercel dashboard, go to your project settings
   - Select "Domains"
   - Add your custom domain and follow the verification process

### Other Deployment Options

- **Netlify**: Similar to Vercel but requires additional configuration for Next.js
- **Railway**: Provides both hosting and database services in one platform
- **AWS Amplify**: Good for enterprise-level applications with complex infrastructure needs
- **Self-hosted**: Deploy to your own server using Docker and Nginx

## Switching from Mock to Real Data

This project includes both mock data and real database implementations:

- The application will attempt to use real database first
- If database connection fails, it will fall back to mock data for development
- For best results, set up a proper database connection

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Run the database check utility:
```bash
node src/db-check.js
```

2. Check that your DATABASE_URL in .env.local or .env is correct
3. Make sure PostgreSQL is running and accessible
4. For local development, try using:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/socimed"
```

### Prisma Model Issues

If you encounter errors with Prisma models like:
```
Property 'friendRequest' does not exist on type 'PrismaClient'
```

Try these steps:
1. Regenerate the Prisma client:
```bash
npx prisma generate
```

2. Check your schema.prisma models - Prisma uses PascalCase for model names but camelCase in the client:
```
// In schema.prisma
model FriendRequest { ... }

// In code
prisma.friendRequest.findMany()
```

3. Restart your development server:
```bash
npm run dev
```

### Component Rendering Issues

If components don't render correctly:

1. Check browser console for errors
2. Verify that the required context providers are properly set up
3. Ensure all dependencies are correctly installed
4. Clear browser cache and reload

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
