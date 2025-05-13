# Branch Protection Rules

This document outlines the branch protection rules implemented for the Socimed repository.

## Main Branch Protection

The `main` branch is protected with the following rules:

### Required Settings

1. **Require a pull request before merging**
   - Prevents direct pushes to the main branch
   - Ensures code is reviewed before being merged

2. **Require approvals**
   - At least 1 approval is required before merging
   - Ensures another developer reviews the code

3. **Dismiss stale pull request approvals when new commits are pushed**
   - Ensures reviewers see the latest changes
   - Prevents merging code that hasn't been reviewed after changes

4. **Require status checks to pass before merging**
   - Ensures CI/CD checks pass before code can be merged
   - Prevents broken code from being merged

5. **Require branches to be up to date before merging**
   - Ensures PRs are updated with the latest changes from main
   - Prevents merge conflicts and ensures compatibility with recent changes

### How to Implement

1. Go to your GitHub repository at https://github.com/Hakeemolaj/socimed
2. Click on "Settings" > "Branches"
3. Under "Branch protection rules", click "Add rule"
4. Enter "main" as the branch name pattern
5. Configure the settings as described above
6. Click "Create" to save the rule

## Development Workflow

With these branch protection rules in place, the development workflow should be:

1. Create a new branch for each feature or bug fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit them
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push the branch to GitHub
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub
   - Go to the repository on GitHub
   - Click "Compare & pull request"
   - Add a description of your changes
   - Request reviews from team members

5. Address any feedback and make necessary changes

6. Once approved and all checks pass, merge the PR
   - The PR can be merged via the GitHub interface

## Benefits

- Prevents accidental pushes to the main branch
- Ensures code quality through peer review
- Maintains a stable main branch
- Creates a clear history of changes
- Facilitates collaboration among team members
