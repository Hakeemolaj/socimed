# Contributing to Socimed

Thank you for considering contributing to Socimed! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template to create a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your environment (OS, browser, version)

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template to create a new issue
- Clearly describe the feature and its benefits
- Consider including mockups or diagrams if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request to the `main` branch
6. Use the pull request template to provide information about your changes

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/Hakeemolaj/socimed.git
cd socimed
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and OAuth credentials
```

4. Set up the database
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

## Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Write tests for new features
- Update documentation when necessary

## Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Update the tests if applicable
3. The PR should work in all supported browsers
4. The PR will be merged once it receives approval from a maintainer

Thank you for your contributions!
