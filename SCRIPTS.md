# Available Scripts

This document describes all available npm scripts in the project.

## Development Scripts

### `npm run dev`
Starts the Next.js development server.

```bash
npm run dev
```

- Runs on http://localhost:3000
- Hot module reloading enabled
- Shows TypeScript errors in terminal
- Reloads automatically on file changes

**Use case**: Development and testing locally.

### `npm run build`
Creates an optimized production build.

```bash
npm run build
```

- Generates static HTML files
- Optimizes JavaScript and CSS
- Performs TypeScript type checking
- Shows build performance metrics
- Output in `.next/` directory

**Use case**: Before deploying or testing production build locally.

### `npm start`
Runs the production server.

```bash
npm start
```

- Must run `npm run build` first
- Runs on http://localhost:3000
- Serves pre-built static and optimized files
- Best simulates Vercel environment

**Use case**: Testing production build before deployment.

### `npm run lint`
Runs ESLint to check code quality.

```bash
npm run lint
```

- Checks for code style issues
- Identifies potential bugs
- Uses Next.js recommended rules
- Configuration in `.eslintrc.json`

**Use case**: Ensure code quality and consistency.

## Additional Scripts

### TypeScript Checking
Built into the build process automatically.

### Testing (Not Configured)
To add testing:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev ts-jest @types/jest
```

Then create `jest.config.js` and add tests in `__tests__/` directories.

## Data Import Script

### `npx ts-node scripts/import-data.ts <source-directory>`
Imports markdown quote files from external source.

```bash
npx ts-node scripts/import-data.ts /path/to/quotes
```

- Copies all `.md` files from source to `data/`
- Creates `data/` directory if needed
- Prints progress and summary

**Use case**: Bulk import quotes from external source.

**Requirements**:
- Source directory must exist
- Source directory must contain `.md` files
- Files are copied, not moved

**Example**:
```bash
npx ts-node scripts/import-data.ts ~/Downloads/sontoku-quotes
```

## Full Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start development
npm run dev

# 3. Open http://localhost:3000
# Make changes, save files for hot reload

# 4. Check code quality
npm run lint

# 5. Before deployment, create build
npm run build

# 6. Test production build
npm start

# 7. If satisfied, push to GitHub and deploy to Vercel
git add .
git commit -m "Update quotes"
git push origin main
```

## Troubleshooting

### dev server won't start
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Try again
npm run dev
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript errors
```bash
# TypeScript checking happens during build
# Fix errors shown in terminal
# Check tsconfig.json for configuration
```

### ESLint warnings
```bash
# Review and fix files listed
npm run lint

# Some issues can be auto-fixed
npm run lint -- --fix
```

## Environment Files

### `.env.local` (not in repo)
For local development secrets:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `.env.example` (optional)
Template showing required variables:

```
NEXT_PUBLIC_SITE_URL=
```

## Package Management

### Update Dependencies
```bash
npm update
```

### Add New Package
```bash
npm install package-name
npm install --save-dev package-name  # dev only
```

### Remove Package
```bash
npm uninstall package-name
```

## Performance Monitoring

### Build Analysis
```bash
npm run build

# Check .next/static/chunks for bundle sizes
```

### Runtime Performance
Open Chrome DevTools:
1. Network tab - check page load
2. Lighthouse tab - performance audit
3. Coverage tab - unused CSS/JS

## CI/CD Integration

For GitHub Actions, add `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

## More Information

- Next.js docs: https://nextjs.org/docs
- npm scripts docs: https://docs.npmjs.com/misc/scripts
- Tailwind docs: https://tailwindcss.com/docs
