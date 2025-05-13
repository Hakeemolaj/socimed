# Development Workflow

This document outlines the development workflow for the Socimed project, incorporating branch protection rules and project board usage.

## Overview

The Socimed development workflow follows these key principles:

1. **Feature Branch Development**: All development happens in feature branches, not directly on main
2. **Pull Request Reviews**: All code changes require review via pull requests
3. **Continuous Integration**: Automated tests run on all pull requests
4. **Continuous Deployment**: Successful merges to main are automatically deployed
5. **Task Tracking**: All work is tracked on the project board

## Step-by-Step Workflow

### 1. Pick or Create a Task

1. Check the "To Do" column on the [Socimed Development](https://github.com/Hakeemolaj/socimed/projects) project board
2. Select a task to work on, or create a new issue if needed
3. Assign yourself to the issue
4. Move the issue to "In Progress" on the project board

### 2. Create a Feature Branch

1. Ensure your local repository is up to date with the main branch:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a new branch with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use prefixes to categorize your branch:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation changes
   - `refactor/` for code refactoring
   - `test/` for adding or updating tests

### 3. Implement Changes

1. Make your changes, following the project's coding standards
2. Write tests for your changes
3. Commit your changes with descriptive commit messages:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
   
   Use conventional commit messages:
   - `feat: add user profile page`
   - `fix: resolve login error on mobile devices`
   - `docs: update installation instructions`
   - `test: add unit tests for auth service`
   - `refactor: improve post component structure`

4. Push your branch to GitHub:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### 4. Create a Pull Request

1. Go to the repository on GitHub
2. Click "Compare & pull request" for your branch
3. Fill out the pull request template:
   - Provide a clear title and description
   - Reference the issue number (e.g., "Fixes #123")
   - Check all items in the checklist
4. Request reviews from team members
5. The PR will automatically be added to the "Review" column on the project board

### 5. Address Review Feedback

1. Reviewers will provide feedback on your PR
2. Make necessary changes based on feedback
3. Commit and push additional changes to the same branch
4. Respond to review comments

### 6. Merge the Pull Request

Once the PR is approved and all checks pass:

1. Ensure the branch is up to date with main:
   ```bash
   git checkout feature/your-feature-name
   git pull origin main
   git push
   ```

2. Resolve any merge conflicts if needed
3. Click "Merge pull request" on GitHub
4. Delete the branch after merging
5. The issue will automatically move to "Done" on the project board

### 7. Deployment

1. When changes are merged to main, the GitHub Actions workflow will automatically:
   - Build the application
   - Run tests
   - Deploy to Vercel
2. Verify the deployment at [https://socimed-ew4i-do15xhakz-hakeemolajs-projects.vercel.app](https://socimed-ew4i-do15xhakz-hakeemolajs-projects.vercel.app)

## Best Practices

### Code Quality

- Follow the project's coding standards
- Write clean, readable, and maintainable code
- Include comments for complex logic
- Write tests for new features and bug fixes

### Commits and PRs

- Keep commits focused and atomic
- Use descriptive commit messages
- Keep PRs small and focused on a single issue
- Update documentation when necessary

### Communication

- Provide clear descriptions in issues and PRs
- Respond promptly to review comments
- Ask for help when needed
- Keep the project board updated

### Testing

- Run tests locally before pushing
- Ensure all tests pass before requesting review
- Add new tests for new features
- Update tests when changing existing functionality

## Troubleshooting

### CI/CD Issues

If the CI/CD pipeline fails:

1. Check the GitHub Actions logs for errors
2. Fix any failing tests or build issues
3. Push the changes to your branch
4. The CI/CD pipeline will run again automatically

### Merge Conflicts

If you encounter merge conflicts:

1. Pull the latest changes from main:
   ```bash
   git checkout feature/your-feature-name
   git pull origin main
   ```

2. Resolve conflicts in your code editor
3. Commit the resolved conflicts:
   ```bash
   git add .
   git commit -m "Resolve merge conflicts"
   ```

4. Push the changes:
   ```bash
   git push
   ```

## Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
