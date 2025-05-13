/**
 * GitHub Repository Setup Script
 *
 * This script helps set up a GitHub repository using the Model-Context-Protocol approach.
 *
 * Model: Defines the repository structure and metadata
 * Context: Sets up the environment and configuration
 * Protocol: Establishes the communication method with GitHub
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
    '.env.production',
    'node_modules',
    '.next',
    '*.log'
  ]
};

// Context: Set up the environment and configuration
function setupContext() {
  console.log('🔧 Setting up context...');

  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'pipe' });
    console.log('✅ Git is installed');
  } catch (error) {
    console.error('❌ Git is not installed. Please install Git and try again.');
    process.exit(1);
  }

  // Remove existing .git directory if it exists
  const gitDir = path.join(rootDir, '.git');
  if (fs.existsSync(gitDir)) {
    console.log('🗑️ Removing existing .git directory...');
    try {
      // Use fs to recursively remove the directory
      fs.rmSync(gitDir, { recursive: true, force: true });
      console.log('✅ Removed existing .git directory');
    } catch (error) {
      console.error('❌ Failed to remove .git directory:', error.message);
      process.exit(1);
    }
  }

  // Initialize Git repository
  console.log('🚀 Initializing Git repository...');
  try {
    execSync('git init', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Git repository initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Git repository:', error.message);
    process.exit(1);
  }

  // Configure Git user
  try {
    execSync('git config --global user.name "Hakeemolaj"', { stdio: 'inherit' });
    execSync('git config --global user.email "hakeemolaj@gmail.com"', { stdio: 'inherit' });
    console.log('✅ Git user configured');
  } catch (error) {
    console.error('❌ Failed to configure Git user:', error.message);
    process.exit(1);
  }

  // Update .gitignore
  updateGitignore(repoModel.ignoreFiles);
}

// Update .gitignore file with necessary entries
function updateGitignore(ignoreFiles) {
  console.log('📝 Updating .gitignore...');

  const gitignorePath = path.join(rootDir, '.gitignore');
  let gitignoreContent = '';

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    console.log('✅ .gitignore file exists');
  } else {
    console.log('🔨 Creating .gitignore file...');
    gitignoreContent = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.\n\n`;
  }

  // Add missing entries to .gitignore
  const missingEntries = [];
  for (const file of ignoreFiles) {
    if (!gitignoreContent.includes(file)) {
      missingEntries.push(file);
    }
  }

  if (missingEntries.length > 0) {
    console.log(`✏️ Adding ${missingEntries.length} entries to .gitignore...`);
    const newContent = gitignoreContent + '\n# Added by GitHub Setup Script\n' + missingEntries.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
    console.log('✅ .gitignore updated');
  } else {
    console.log('✅ .gitignore already contains all necessary entries');
  }
}

// Protocol: Establish communication with GitHub
function setupProtocol() {
  console.log('🔄 Setting up protocol...');

  // Stage all files
  console.log('📦 Staging files...');
  try {
    execSync('git add .', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Files staged');
  } catch (error) {
    console.error('❌ Failed to stage files:', error.message);
    process.exit(1);
  }

  // Commit changes
  console.log('💾 Committing changes...');
  try {
    execSync('git commit -m "Initial commit"', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Changes committed');
  } catch (error) {
    console.error('❌ Failed to commit changes:', error.message);
    process.exit(1);
  }

  // Instructions for GitHub repository creation
  console.log('\n📋 GitHub Repository Creation Instructions:');
  console.log('1. Go to https://github.com/new');
  console.log(`2. Enter "${repoModel.name}" as the repository name`);
  console.log(`3. Enter "${repoModel.description}" as the description`);
  console.log(`4. Choose "${repoModel.isPrivate ? 'Private' : 'Public'}" visibility`);
  console.log('5. Do NOT initialize with README, .gitignore, or license');
  console.log('6. Click "Create repository"');

  // Instructions for pushing to GitHub
  console.log('\n📤 After creating the repository, run these commands:');
  console.log(`git remote add origin https://github.com/Hakeemolaj/${repoModel.name}.git`);
  console.log(`git push -u origin ${repoModel.defaultBranch || 'main'}`);

  // Alternative instructions for SSH
  console.log('\n🔐 Alternatively, if you prefer SSH, use:');
  console.log(`git remote add origin git@github.com:Hakeemolaj/${repoModel.name}.git`);
  console.log(`git push -u origin ${repoModel.defaultBranch || 'main'}`);
}

// Main function
function main() {
  console.log('🚀 Starting GitHub Setup...');
  console.log(`Repository: ${repoModel.name}`);
  console.log(`Description: ${repoModel.description}`);
  console.log(`Visibility: ${repoModel.isPrivate ? 'Private' : 'Public'}`);

  setupContext();
  setupProtocol();

  console.log('\n✨ Setup complete!');
}

// Run the script
main();
