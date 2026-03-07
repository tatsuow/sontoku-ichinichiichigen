# 二宮尊徳一日一言 (Ninomiya Sontoku Daily Quote)

A beautiful Next.js + Tailwind CSS website for daily Ninomiya Sontoku quotes, featuring a warm brown color scheme with Japanese typography. The site includes both a public-facing quote display and an admin panel for managing quote data.

## Features

- **Home Page (/)**: Displays today's quote with comprehensive sections (原文, 現代語訳, 語句解説, 補足・背景, 仕事／暮らしへの示唆等)
- **Admin Page (/admin)**: Data management interface with:
  - AI specification documentation
  - Quote registration form with image upload
  - Collapsible detailed fields
  - Registered quotes list with filtering and sorting
  - Edit and delete functionality (UI ready)
- **Static Site Generation (SSG)**: All data is prerendered at build time for optimal Vercel deployment
- **Responsive Design**: Mobile-friendly layout
- **Japanese Typography**: Uses Noto Serif JP and Noto Sans JP from Google Fonts
- **Design System**: Warm brown color palette matching Figma design specifications

## Project Structure

```
sontoku-site/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin page
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navigation.tsx         # Tab navigation
│   │   ├── AISpecification.tsx    # Collapsible AI docs
│   │   ├── RegistrationForm.tsx   # Quote registration form
│   │   └── QuotesTable.tsx        # Quotes list with filtering
│   ├── lib/
│   │   └── quotes.ts              # Quote reading and parsing utilities
│   └── types/
│       └── quote.ts               # TypeScript types
├── data/                          # Markdown quote files
├── scripts/
│   └── import-data.ts             # Script to import quotes from external source
├── tailwind.config.ts             # Tailwind configuration with design tokens
├── next.config.ts                 # Next.js configuration
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd sontoku-site
npm install
```

### 2. Add Quote Data

Create markdown files in the `/data` directory with the following structure:

```markdown
---
title: 至誠神の如し
source: 二宮尊徳一日一言 致知出版社
tags:
  - 二宮尊徳
  - 哲学
---

## 原文
至誠なれば、神の如くなるべし。...

## 現代語訳
心から誠実であれば、神のような力を発揮することができるであろう。...

## 語句解説
**至誠**: 心から誠実なこと。偽りや隠蔽のない純粋な心。
...

## 補足・背景
二宮尊徳は江戸時代の農政家で、...

## 仕事／暮らしへの示唆等
ビジネスであれ、個人の生活であれ、...
```

**Filename Format**: `YYYY-MM-DD_title.md`
- Example: `2026-03-07_至誠神の如し.md`
- The date in the filename represents the calendar day (03-07 = March 7)

### 3. Import Quote Data (Optional)

To import quotes from an external directory:

```bash
npx ts-node scripts/import-data.ts /path/to/source/quotes
```

## Development

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Design System

### Color Palette

- **Primary Text**: #3d3428 (dark brown)
- **Secondary Text**: #8a7d6b (muted brown)
- **Background**: #faf8f5 (warm white)
- **Card Background**: #ffffff (white)
- **Input Background**: #f5f1ec
- **Primary Button**: #6b5344 (brown)
- **Accent Gradient**: from-[#7f22fe] to-[#4f39f6] (purple)
- **Border**: rgba(107,83,68,0.15)

### Typography

- **Headings**: Noto Serif JP (Medium weight)
- **Body**: Noto Sans JP (Regular and Medium weights)

### Spacing & Sizing

- **Border Radius**: 
  - Inputs/Buttons: 10px
  - Cards: 14px
- **Shadow**: 0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)

## Key Components

### Home Page (`/src/app/page.tsx`)

Displays today's quote automatically based on system date. Features:
- Prominent title and date display
- Full quote sections with proper formatting
- Responsive grid layout
- Revalidates daily (86400 seconds)

### Admin Page (`/src/app/admin/page.tsx`)

Complete data management interface with:

#### AISpecification Component
- Collapsible section explaining AI analysis features
- Documents the data structure and flow

#### RegistrationForm Component
- **Step 1**: Image upload with drag & drop
- **Step 2**: Analysis options (AI or MD file import)
- **Step 3**: Basic info (month, day, title, modern translation)
- **Details**: Expandable section for additional fields
- Dynamic button text showing selected date

#### QuotesTable Component
- Displays all registered quotes
- Filter by month dropdown
- Status columns (詳細, 画像)
- Edit and delete action buttons
- Responsive table with horizontal scrolling

### Utility Functions (`/src/lib/quotes.ts`)

- `getAllQuotes()`: Reads all MD files and returns sorted array
- `getQuoteByDate(month, day)`: Get a specific quote
- `getTodayQuote()`: Get today's quote
- `parseMarkdownContent()`: Extract sections from markdown
- `formatDateString()`: Format date as Japanese (月日)

## Data Loading Flow

1. Build time: Next.js reads all markdown files from `/data`
2. Parsing: gray-matter extracts YAML frontmatter and markdown content
3. Filtering: Only quotes with `source: 二宮尊徳一日一言` are included
4. Sorting: Quotes are sorted by month then day
5. SSG: All pages are prerendered as static HTML
6. Runtime: Client-side UI for admin features (no server actions)

## Dependencies

- **Next.js 16.1.6**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **gray-matter**: YAML frontmatter parsing
- **remark/remark-html**: Markdown parsing utilities

## Deployment

The site is optimized for Vercel deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically builds and deploys
4. Static pages are cached globally with ISR (Incremental Static Regeneration)

## File Naming Conventions

Quote markdown files follow this pattern:
- `YYYY-MM-DD_title.md`
- Year-Month-Day must match calendar dates
- Example: `2026-03-07_至誠神の如し.md` represents March 7, 2026

## Future Enhancements

- Server actions for actual quote creation/editing
- Database integration (PostgreSQL, MongoDB, etc.)
- Image upload and storage (S3, Vercel Blob)
- AI integration for automatic transcription
- User authentication for admin access
- Quote scheduling and publication workflow

## Styling Notes

All components use inline Tailwind classes for maximum compatibility with Next.js App Router and Turbopack. The design maintains consistency with the Figma specifications while being fully responsive.

## License

This project is created for the Ninomiya Sontoku Daily Quote website.
