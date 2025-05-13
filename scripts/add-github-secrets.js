/**
 * GitHub Secrets Setup Script
 * 
 * This script helps you add secrets to your GitHub repository for Vercel deployment.
 * 
 * Prerequisites:
 * 1. Node.js installed
 * 2. GitHub CLI (gh) installed and authenticated
 * 
 * Usage:
 * node scripts/add-github-secrets.js
 */

import { execSync } from 'child_process';

// Vercel credentials
const secrets = {
  VERCEL_TOKEN: 'X4sIb5JxJTibkG7EIBUS0N5R',
  VERCEL_PROJECT_ID: 'prj_CxfgEhWUgoQTucqm1S0NRrXXCf2X',
  VERCEL_ORG_ID: 'UkOd6GWRU3aUqiLF7BwkzUwA'
};

// Repository information
const repoOwner = 'Hakeemolaj';
const repoName = 'socimed';

/**
 * Add a secret to the GitHub repository using GitHub CLI
 * @param {string} name - Secret name
 * @param {string} value - Secret value
 */
function addSecret(name, value) {
  try {
    console.log(`Adding secret: ${name}...`);
    
    // Use GitHub CLI to add the secret
    execSync(`gh secret set ${name} -b"${value}" --repo ${repoOwner}/${repoName}`, {
      stdio: 'inherit'
    });
    
    console.log(`✅ Successfully added secret: ${name}`);
  } catch (error) {
    console.error(`❌ Failed to add secret ${name}: ${error.message}`);
    
    // Provide manual instructions
    console.log('\nManual instructions:');
    console.log('1. Go to https://github.com/Hakeemolaj/socimed/settings/secrets/actions');
    console.log('2. Click "New repository secret"');
    console.log(`3. Name: ${name}`);
    console.log(`4. Value: ${value}`);
    console.log('5. Click "Add secret"\n');
  }
}

/**
 * Check if GitHub CLI is installed
 */
function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting GitHub Secrets Setup...');
  
  // Check if GitHub CLI is installed
  if (!checkGitHubCLI()) {
    console.error('❌ GitHub CLI (gh) is not installed or not in PATH.');
    console.log('Please install GitHub CLI from https://cli.github.com/');
    console.log('After installation, authenticate with: gh auth login');
    
    console.log('\nAlternatively, you can add the secrets manually:');
    console.log('1. Go to https://github.com/Hakeemolaj/socimed/settings/secrets/actions');
    console.log('2. Click "New repository secret"');
    console.log('3. Add each secret with its name and value');
    
    process.exit(1);
  }
  
  // Add each secret
  for (const [name, value] of Object.entries(secrets)) {
    addSecret(name, value);
  }
  
  console.log('\n✨ Setup complete!');
  console.log('Your GitHub Actions workflow should now be able to deploy to Vercel.');
  console.log('Make a small change to your repository, commit, and push to trigger the deployment.');
}

// Run the script
main();
