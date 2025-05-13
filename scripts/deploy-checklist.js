#!/usr/bin/env node

/**
 * This script checks if your project is ready for production deployment.
 * Run with: npm run deploy:check
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ES Modules polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Socimed deployment checklist...');
console.log('==========================================\n');

let errors = 0;
let warnings = 0;

// Check for critical environment variables
try {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env.production'), 'utf8');
  
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DATABASE_URL'
  ];
  
  const placeholderValues = [
    'replace_with_actual_production_secret',
    'https://your-production-domain.com',
    'replace_with_actual_production_client_id',
    'replace_with_actual_production_client_secret',
    'postgresql://username:password@host:port/database'
  ];
  
  console.log('✅ Checking environment variables:');
  
  requiredVars.forEach((varName, index) => {
    if (!envFile.includes(varName)) {
      console.log(`  ❌ Missing required variable: ${varName}`);
      errors++;
    } else if (envFile.includes(placeholderValues[index])) {
      console.log(`  ⚠️ ${varName} is using a placeholder value. Update before deployment.`);
      warnings++;
    } else {
      console.log(`  ✓ ${varName} is set`);
    }
  });
} catch (err) {
  console.log('  ❌ .env.production file not found! Create it before deployment.');
  errors++;
}

console.log('\n✅ Checking for build issues:');

try {
  console.log('  ⏳ Running type check...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('  ✓ TypeScript type check passed');
} catch (err) {
  console.log('  ❌ TypeScript errors detected!');
  console.log('     Run "npx tsc --noEmit" to see the errors');
  errors++;
}

try {
  console.log('  ⏳ Running linter...');
  execSync('npx eslint .', { stdio: 'pipe' });
  console.log('  ✓ Linting passed');
} catch (err) {
  console.log('  ⚠️ Linting issues detected');
  console.log('     Run "npx eslint ." to see the warnings');
  warnings++;
}

try {
  console.log('  ⏳ Checking database schema...');
  execSync('npx prisma validate', { stdio: 'pipe' });
  console.log('  ✓ Database schema validation passed');
} catch (err) {
  console.log('  ❌ Prisma schema errors detected!');
  console.log('     Run "npx prisma validate" to see the errors');
  errors++;
}

console.log('\n✅ Final checks:');

// Check for build script
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('  ✓ Build script exists');
  } else {
    console.log('  ❌ No build script found in package.json!');
    errors++;
  }
} catch (err) {
  console.log('  ❌ Could not read package.json');
  errors++;
}

console.log('\n==========================================');
console.log(`📋 Summary: ${errors} errors, ${warnings} warnings`);

if (errors > 0) {
  console.log('\n❌ Your project is NOT ready for deployment. Fix the errors above.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️ Your project has warnings but can be deployed. Consider fixing them first.');
  process.exit(0);
} else {
  console.log('\n🚀 Your project is ready for deployment!');
  console.log('Follow the deployment guide in README.md to deploy to Vercel.');
  process.exit(0);
} 