# Setup Guide for 二宮尊徳一日一言 Website

This guide will help you get the website running locally and deploying to production.

## Prerequisites

- Node.js 18+ and npm
- Git (for version control)
- A code editor (VS Code recommended)

## Local Development Setup

### 1. Install Dependencies

```bash
cd /sessions/confident-ecstatic-euler/sontoku-site
npm install
```

### 2. Prepare Quote Data

Create markdown files in the `data/` directory. Example:

```bash
mkdir -p data
```

Create a file `data/2026-03-07_至誠神の如し.md`:

```yaml
---
title: 至誠神の如し
source: 二宮尊徳一日一言 致知出版社
tags:
  - 二宮尊徳
  - 哲学
---

## 原文
至誠なれば、神の如くなるべし。偽りなき心、正直なる行為をもって、一つの事に当たらば、何ぞ成らざるべきや。

## 現代語訳
心から誠実であれば、神のような力を発揮することができるであろう。

## 語句解説
**至誠**: 心から誠実なこと。

## 補足・背景
二宮尊徳は江戸時代の農政家で、「報徳」の思想を唱えた。

## 仕事／暮らしへの示唆等
誠実さなくして長期的な成功はない。
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Test Pages

- **Home Page**: http://localhost:3000
  - Shows today's quote (03-07 if you're testing with sample data)
- **Admin Page**: http://localhost:3000/admin
  - Shows data management interface
  - View registered quotes in the table
  - Test form interactions

## Building for Production

### 1. Create Production Build

```bash
npm run build
```

This generates optimized static files in `.next/out/`.

### 2. Test Production Build Locally

```bash
npm run start
```

Open http://localhost:3000 to test.

## File Structure Overview

```
data/                          # Quote data (markdown files)
├── 2026-03-06_小事を務むべし.md
├── 2026-03-07_至誠神の如し.md
└── ...

src/
├── app/
│   ├── admin/
│   │   └── page.tsx           # Admin page (no 'use client' needed)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout with nav + footer
│   └── page.tsx               # Home page
│
├── components/
│   ├── AISpecification.tsx    # 'use client' - Collapsible docs
│   ├── Navigation.tsx         # 'use client' - Top navigation
│   ├── RegistrationForm.tsx   # 'use client' - Quote form
│   └── QuotesTable.tsx        # 'use client' - Data table
│
├── lib/
│   └── quotes.ts              # Server-side quote utilities
│
└── types/
    └── quote.ts               # TypeScript interfaces
```

## Adding More Quote Data

### Manual Entry

1. Create a new markdown file in `data/` directory
2. Follow this naming pattern: `YYYY-MM-DD_title.md`
3. Include YAML frontmatter with required fields
4. Add content sections starting with `## `

### Batch Import

If you have quotes in another directory:

```bash
npx ts-node scripts/import-data.ts /path/to/quotes
```

This copies all `.md` files from the source directory to `data/`.

## Quote Data Format

### Filename Rules
- Format: `YYYY-MM-DD_title.md`
- Year-Month-Day must be valid calendar dates
- Use underscores to separate date from title
- Examples:
  - `2026-03-07_至誠神の如し.md` (March 7, 2026)
  - `2026-01-01_元旦の言葉.md` (January 1, 2026)

### Frontmatter (Required)
```yaml
---
title: Quote title in Japanese
source: 二宮尊徳一日一言 致知出版社
tags:
  - tag1
  - tag2
---
```

### Content Sections (Optional)
All sections are optional, but recommended for full experience:

```markdown
## 原文
[Original text from the book]

## 現代語訳
[Modern Japanese translation]

## 語句解説
[Explanation of difficult terms with definitions]

## 補足・背景
[Historical context and background]

## 仕事／暮らしへの示唆等
[Practical applications to work and daily life]
```

## How the Home Page Works

1. **Build Time**: When you run `npm run build` or deploy to Vercel, the system:
   - Reads all `.md` files in `data/`
   - Parses YAML frontmatter
   - Filters for `source: 二宮尊徳一日一言`
   - Sorts by month then day
   - Generates static HTML

2. **Runtime**: When a user visits the page:
   - Today's date is determined
   - Quote for today's month/day is displayed
   - Page revalidates once per day (ISR)

3. **If No Quote for Today**: 
   - Shows message: "本日の言葉はまだ登録されていません"

## Admin Page Features

### Registration Form
- **Step 1**: Image upload with drag & drop
- **Step 2**: Choose data source (AI or MD file)
- **Step 3**: Enter month, day, title, modern translation
- **Details**: Expand to add 原文, 語句解説, 補足・背景, 示唆

Currently, the form is a UI demo. To implement actual saving:
1. Add server actions to `src/app/admin/page.tsx`
2. Implement database or file system updates
3. Add authentication

### Quotes Table
- View all registered quotes
- Filter by month
- Edit and delete buttons (UI ready)
- Shows data completeness status

## Design System Customization

All colors and fonts are defined in:
- `tailwind.config.ts` - Color tokens and custom utilities
- `src/app/globals.css` - Global styles
- Component files - Inline Tailwind classes

To customize:
1. Update color values in `tailwind.config.ts`
2. Update font imports in `globals.css`
3. Adjust component classNames

## Environment Variables (Optional)

If you need to add environment variables later:

1. Create `.env.local`:
```
NEXT_PUBLIC_SITE_NAME=二宮尊徳一日一言
NEXT_PUBLIC_API_URL=http://localhost:3000
```

2. Access in code:
```typescript
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"

### 3. Configure Build Settings (Optional)

In Vercel dashboard:
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 4. Add Custom Domain (Optional)

1. In Vercel project settings
2. Go to "Domains"
3. Add your domain

### 5. Deploy from Git

Every push to `main` automatically triggers a new deployment.

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (need 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check markdown files in `data/` for syntax errors

### Quote Not Showing on Home Page
- Verify markdown file exists in `data/`
- Check filename follows format: `YYYY-MM-DD_title.md`
- Verify frontmatter includes `source: 二宮尊徳一日一言`
- Confirm month and day match current date
- Rebuild: `npm run build`

### Styling Issues
- Clear Tailwind cache: `npm run build -- --reset`
- Verify Tailwind config has correct content paths
- Check inline class names for typos

### Dev Server Issues
- Kill process: `lsof -ti:3000 | xargs kill`
- Restart: `npm run dev`

## Performance Tips

1. **Image Optimization**: Use next/image for quote screenshots
2. **Font Loading**: Google Fonts are cached globally
3. **Caching**: Static pages are cached for 1 year, ISR after 1 day
4. **Bundle Size**: Tailwind purges unused CSS in production

## Next Steps

1. Add your quote data to `data/` directory
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy to Vercel
5. Monitor performance in Vercel Analytics

For questions or issues, check the README.md for more detailed information.
