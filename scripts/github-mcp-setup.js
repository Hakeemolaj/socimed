/**
 * GitHub Model-Context-Protocol Setup Script
 *
 * This script helps set up a GitHub repository using the Model-Context-Protocol approach.
 *
 * Model: Defines the repository structure and metadata
 * Context: Sets up the environment and configuration
 * Protocol: Establishes the communication method with GitHub
 */

// Import required modules
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Model: Define the repository structure and metadata
const repoModel = {
  name: 'socimed',
  description: 'A full-featured social media platform built with Next.js, TypeScript, Prisma, and NextAuth.',
  isPrivate: false,
  defaultBranch: 'main',
  ignoreFiles: [
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    'node_modules',
    '.next',
    '*.log'
  ]
};

// Context: Set up the environment and configuration
function setupContext() {
  console.log('Setting up context...');

  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git is installed');
  } catch (error) {
    console.error('❌ Git is not installed. Please install Git and try again.');
    process.exit(1);
  }

  // Check if repository is already initialized
  const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
  if (!isGitRepo) {
    console.log('Initializing Git repository...');
    execSync('git init', { stdio: 'inherit' });
  } else {
    console.log('✅ Git repository already initialized');
  }

  // Update .gitignore if needed
  updateGitignore(repoModel.ignoreFiles);

  // Configure Git user if not already configured
  try {
    execSync('git config user.name', { stdio: 'ignore' });
    execSync('git config user.email', { stdio: 'ignore' });
    console.log('✅ Git user already configured');
  } catch (error) {
    console.log('Configuring Git user...');
    const username = process.env.GIT_USERNAME || 'Hakeemolaj';
    const email = process.env.GIT_EMAIL || 'hakeemolaj@gmail.com';

    execSync(`git config --global user.name "${username}"`, { stdio: 'inherit' });
    execSync(`git config --global user.email "${email}"`, { stdio: 'inherit' });
  }
}

// Update .gitignore file with necessary entries
function updateGitignore(ignoreFiles) {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let gitignoreContent = '';

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    console.log('✅ .gitignore file exists');
  } else {
    console.log('Creating .gitignore file...');
  }

  // Add missing entries to .gitignore
  const missingEntries = [];
  for (const file of ignoreFiles) {
    if (!gitignoreContent.includes(file)) {
      missingEntries.push(file);
    }
  }

  if (missingEntries.length > 0) {
    console.log(`Adding ${missingEntries.length} entries to .gitignore...`);
    const newContent = gitignoreContent + '\n# Added by GitHub MCP Setup\n' + missingEntries.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
  } else {
    console.log('✅ .gitignore already contains all necessary entries');
  }
}

// Protocol: Establish communication with GitHub
function setupProtocol() {
  console.log('Setting up protocol...');

  // Stage all files
  console.log('Staging files...');
  execSync('git add .', { stdio: 'inherit' });

  // Commit changes if there are any
  try {
    const status = execSync('git status --porcelain').toString();
    if (status.trim() !== '') {
      console.log('Committing changes...');
      execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
    } else {
      console.log('✅ No changes to commit');
    }
  } catch (error) {
    console.error('❌ Failed to commit changes:', error.message);
  }

  // Check if remote already exists
  try {
    execSync('git remote get-url origin', { stdio: 'ignore' });
    console.log('✅ Remote "origin" already exists');
  } catch (error) {
    // Add remote
    console.log('Adding remote...');
    const visibility = repoModel.isPrivate ? 'private' : 'public';
    const repoUrl = `https://github.com/Hakeemolaj/${repoModel.name}.git`;

    console.log(`\nTo complete the setup, please do the following manually:`);
    console.log(`1. Create a ${visibility} repository named "${repoModel.name}" on GitHub`);
    console.log(`2. Run the following commands:`);
    console.log(`   git remote add origin ${repoUrl}`);
    console.log(`   git push -u origin ${repoModel.defaultBranch || 'master'}`);
  }
}

// Main function
function main() {
  console.log('🚀 Starting GitHub MCP Setup...');
  console.log(`Repository: ${repoModel.name}`);
  console.log(`Description: ${repoModel.description}`);
  console.log(`Visibility: ${repoModel.isPrivate ? 'Private' : 'Public'}`);

  setupContext();
  setupProtocol();

  console.log('\n✨ Setup complete!');
}

// Run the script
main();
