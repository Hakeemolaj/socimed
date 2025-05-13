# Socimed Deployment Guide

This guide will walk you through the process of deploying the Socimed social media platform to the web.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- PostgreSQL database (you can use services like Supabase, Railway, Neon, or others)
- Google OAuth credentials for production

## Deployment Steps

### 1. Prepare Your Database

1. **Create a PostgreSQL database**:
   - Sign up for a database service like [Supabase](https://supabase.com) or [Neon](https://neon.tech)
   - Create a new PostgreSQL database
   - Copy your database connection string, it will look like:
     ```
     postgresql://username:password@host:port/database
     ```

### 2. Update Google OAuth Credentials

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Navigate to your project's credentials**
3. **Add your production domain to authorized origins**:
   - Add `https://yourdomain.com` or `https://your-vercel-app.vercel.app`
4. **Add your production callback URL**:
   - Add `https://yourdomain.com/api/auth/callback/google` or `https://your-vercel-app.vercel.app/api/auth/callback/google`
5. **Save your changes**

### 3. Prepare Your Code

1. **Ensure you're using PostgreSQL in your schema**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Run the deployment checklist**:
   ```bash
   npm run deploy:check
   ```

3. **Fix any errors or warnings** that are reported

4. **Create a production build locally to test**:
   ```bash
   npm run build
   ```

### 4. Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

2. **Sign up or log in to [Vercel](https://vercel.com)**

3. **Create a new project**:
   - Click "Add New..." and select "Project"
   - Import your GitHub repository
   - Select the "Next.js" framework preset

4. **Configure environment variables**:
   - In the Vercel project settings, go to the "Environment Variables" tab
   - Add the following variables:
     - `NEXTAUTH_SECRET`: A strong random string (use a password generator)
     - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://socimed.vercel.app)
     - `GOOGLE_CLIENT_ID`: Your production Google Client ID
     - `GOOGLE_CLIENT_SECRET`: Your production Google Client Secret
     - `DATABASE_URL`: Your production PostgreSQL database URL

5. **Configure build settings**:
   - Build Command: `npx prisma generate && next build`
   - Output Directory: `.next`

6. **Deploy**:
   - Click "Deploy" to start the deployment process
   - Vercel will build and deploy your application
   - Once complete, you can access your site at the provided URL

### 5. Post-Deployment Tasks

1. **Verify database migration**:
   - Check that your database tables were created correctly
   - You can run `npx prisma db push` manually if needed

2. **Test authentication**:
   - Try logging in with Google
   - Ensure the authentication flow works correctly

3. **Test all features**:
   - Create posts
   - Add friends
   - Like and comment on posts
   - Update profile information

4. **Set up a custom domain (optional)**:
   - In the Vercel dashboard, go to your project settings
   - Select "Domains"
   - Add your custom domain and follow the verification process

## Troubleshooting

### Database Connection Issues

- **Error**: "Can't reach database server"
  - Ensure your database is publicly accessible
  - Check if your IP needs to be whitelisted
  - Verify that the database URL is correct

### Authentication Problems

- **Error**: "Invalid OAuth credentials"
  - Double-check your Google OAuth settings
  - Ensure the redirect URIs are correctly set
  - Verify that you're using the production credentials, not development ones

### Deployment Failures

- **Error**: "Build failed"
  - Check the build logs for specific errors
  - Ensure all dependencies are correctly installed
  - Try running the build locally first with `npm run build`

## Scaling Considerations

As your user base grows, consider:

1. **Database scaling**:
   - Use connection pooling
   - Consider adding caching with Redis
   - Optimize your queries

2. **Media storage**:
   - Set up Cloudinary or similar service for image storage
   - Update your environment variables with Cloudinary credentials

3. **Performance optimization**:
   - Implement server-side caching
   - Use CDN for static assets
   - Optimize images and frontend assets

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Use Vercel Analytics
   - Consider adding error tracking with Sentry

2. **Regular updates**:
   - Keep dependencies up to date
   - Apply security patches promptly

3. **Backup strategy**:
   - Set up regular database backups
   - Test recovery procedures

---

For any further assistance, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) or the [Vercel documentation](https://vercel.com/docs). 