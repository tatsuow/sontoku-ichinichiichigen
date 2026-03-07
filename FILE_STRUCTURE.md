# File Structure Documentation

Complete overview of the project structure and each file's purpose.

## Root Directory

```
sontoku-site/
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore patterns
├── next.config.ts              # Next.js configuration
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Main project documentation
├── SETUP_GUIDE.md             # Step-by-step setup instructions
├── SCRIPTS.md                  # Available npm scripts
├── FILE_STRUCTURE.md           # This file
│
├── data/                       # Quote markdown files
│   ├── 2026-03-06_小事を務むべし.md
│   ├── 2026-03-07_至誠神の如し.md
│   └── ...
│
├── scripts/                    # Utility scripts
│   └── import-data.ts          # Import quotes from external source
│
├── src/                        # Source code
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
│
├── public/                     # Static assets (auto-generated)
│   └── favicon.ico
│
└── .next/                      # Next.js build output (auto-generated)
    ├── out/                    # Static export
    └── ...
```

## src/app Directory - App Router Pages

### src/app/layout.tsx
**Purpose**: Root layout component wrapping all pages

**Key Features**:
- Imports and applies global CSS
- Includes `<Navigation />` component
- Includes footer with attribution
- Sets document metadata (title, description)
- Applies background color and text color

**Key Lines**:
```typescript
- Navigation component at top
- {children} placeholder for page content
- Footer with "出典：二宮尊徳一日一言　致知出版社"
```

### src/app/page.tsx
**Purpose**: Home page displaying today's quote

**Key Features**:
- Async component fetching today's quote
- Displays formatted date (月日 format)
- Shows quote sections (原文, 現代語訳, 語句解説, etc.)
- Responsive layout with card styling
- Revalidates every 24 hours (ISR)

**Key Functions Used**:
- `getTodayQuote()` - Gets quote for current date
- `formatDateString()` - Formats month/day

**Route**: `/` (home page)

### src/app/admin/page.tsx
**Purpose**: Data management administration page

**Key Features**:
- Server component (no 'use client')
- Shows AI specification info
- Displays quote registration form
- Shows list of registered quotes with filtering
- Revalidates every 1 hour

**Components Used**:
- `<AISpecification />` - Collapsible docs
- `<RegistrationForm />` - Quote entry form
- `<QuotesTable />` - Data table

**Key Functions Used**:
- `getAllQuotes()` - Gets all quotes

**Route**: `/admin` (admin page)

### src/app/admin/page.tsx (not yet created but referenced)
Not needed - admin is a single page in `/admin/page.tsx`

### src/app/globals.css
**Purpose**: Global styles and CSS imports

**Contents**:
- Google Fonts imports (Noto Serif JP, Noto Sans JP)
- Tailwind directives (@tailwind base/components/utilities)
- Reset and base styles (*, html, body, h1-h6)
- Background color and typography defaults

**Key Styles**:
- Font family setup
- Text color defaults
- Heading font weights

## src/components Directory - React Components

### src/components/Navigation.tsx
**Purpose**: Top navigation bar with tab links

**Type**: Client component (`'use client'`)

**Features**:
- Two tabs: "ホーム" (/) and "管理" (/admin)
- Active tab highlighted with brown background
- Uses `usePathname()` to detect current page
- Styled with Tailwind inline classes

**Props**: None

**Key Hook**:
- `usePathname()` - Get current route

### src/components/AISpecification.tsx
**Purpose**: Collapsible section explaining AI analysis

**Type**: Client component (`'use client'`)

**Features**:
- Expandable/collapsible button
- Displays AI capabilities documentation
- Lists features being analyzed
- Smooth transition animations

**Props**: None

**State**:
- `isOpen` - Controls expansion state

### src/components/RegistrationForm.tsx
**Purpose**: Form for entering new quote data

**Type**: Client component (`'use client'`)

**Features**:
- 3-step registration process
- Image upload with drag & drop
- Month and day selectors (1-12, 1-31)
- Title and modern translation inputs
- Expandable detailed fields section
- Dynamic button text showing selected date

**Props**: None

**State**:
- `formData` - Form field values
- `expandDetails` - Controls details expansion
- `uploadedImage` - Stores base64 image

**Handlers**:
- `handleInputChange()` - Updates form state
- `handleImageDrop()` - Drag & drop upload
- `handleImageSelect()` - File input upload
- `handleSubmit()` - Form submission (UI demo)

### src/components/QuotesTable.tsx
**Purpose**: Table displaying all registered quotes

**Type**: Client component (`'use client'`)

**Features**:
- Displays quotes in table format
- Filter by month dropdown
- Shows 5 columns: 日付, タイトル, 詳細, 画像, 操作
- Edit and delete icon buttons
- Responsive with horizontal scroll
- Shows item count

**Props**:
- `quotes: Quote[]` - Array of quote data

**State**:
- `filterMonth` - Selected month filter

**Functions**:
- `handleEdit()` - Edit button action (UI demo)
- `handleDelete()` - Delete button action (UI demo)

## src/lib Directory - Utilities

### src/lib/quotes.ts
**Purpose**: Server-side utilities for reading and parsing quote data

**Key Functions**:

#### `getAllQuotes(): Promise<Quote[]>`
- Reads all `.md` files from `/data` directory
- Parses YAML frontmatter with gray-matter
- Extracts month/day from filename
- Filters for "二宮尊徳一日一言" source
- Returns sorted array (by month, then day)

#### `getQuoteByDate(month, day): Promise<Quote | null>`
- Gets single quote for specific month/day
- Returns null if not found

#### `getTodayQuote(): Promise<Quote | null>`
- Gets quote for current month/day
- Uses JavaScript Date object

#### `parseMarkdownContent(content): QuoteContent`
- Splits markdown content by section headers
- Creates object with properties for each section
- Trims whitespace from sections

#### `extractDateFromFilename(filename): {month, day} | null`
- Extracts date from filename format: YYYY-MM-DD
- Returns month and day as numbers

#### `formatDateString(month, day): string`
- Converts numbers to Japanese date format
- Example: 3, 7 → "3月7日"

#### `formatMonthDayString(month, day): string`
- Formats as padded MM-DD string
- Example: 3, 7 → "03-07"

## src/types Directory - Type Definitions

### src/types/quote.ts
**Purpose**: TypeScript interfaces for quote data

**Interfaces**:

#### `QuoteFrontmatter`
```typescript
{
  title: string              // Quote title
  source: string            // Source reference
  tags: string[]           // Category tags
}
```

#### `QuoteContent`
```typescript
{
  raw: string              // Full markdown text
  原文?: string            // Original text
  現代語訳?: string        // Modern translation
  語句解説?: string        // Term explanations
  補足背景?: string        // Background info
  示唆?: string            // Practical implications
}
```

#### `Quote`
```typescript
{
  id: string               // Filename without .md
  month: number            // 1-12
  day: number              // 1-31
  frontmatter: QuoteFrontmatter
  content: QuoteContent
  slug: string             // URL-friendly ID
}
```

#### `QuoteListItem`
```typescript
{
  date: string             // YYYY-MM-DD format
  month: number
  day: number
  title: string
  slug: string
  hasImage: boolean        // For future use
  hasDetails: boolean      // Has detailed sections
}
```

## data Directory - Quote Files

### File Format
- **Location**: `/data/`
- **Naming**: `YYYY-MM-DD_title.md`
- **Example**: `2026-03-07_至誠神の如し.md`

### File Contents

#### Frontmatter (YAML)
```yaml
---
title: Quote title
source: 二宮尊徳一日一言 致知出版社
tags:
  - Tag1
  - Tag2
---
```

#### Sections (Markdown)
```markdown
## 原文
[Original text]

## 現代語訳
[Modern translation]

## 語句解説
[Term definitions]

## 補足・背景
[Historical context]

## 仕事／暮らしへの示唆等
[Practical applications]
```

### Included Sample Files
1. `2026-03-06_小事を務むべし.md` - Sample quote for March 6
2. `2026-03-07_至誠神の如し.md` - Sample quote for March 7

## Configuration Files

### tailwind.config.ts
Tailwind CSS configuration with:
- Custom color palette extending defaults
- Font family definitions (Noto Serif JP, Noto Sans JP)
- Border radius values (10px for inputs, 14px for cards)
- Box shadow specifications
- Content paths for CSS purging

### next.config.ts
Next.js configuration:
- React Strict Mode enabled
- Standard Next.js settings

### tsconfig.json
TypeScript configuration:
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases (@/...)

### postcss.config.js
PostCSS configuration for Tailwind processing

### .eslintrc.json
ESLint rules for code quality:
- Next.js recommended rules
- React best practices

## Build Artifacts (Auto-Generated)

### .next/
Generated during `npm run build`:
- Compiled JavaScript
- Optimized CSS
- Static pages (in `out/` for SSG)

### node_modules/
Package dependencies (created by `npm install`)

## Git Configuration

### .gitignore
Excluded from version control:
- `node_modules/`
- `.next/`
- `.env.local`
- `dist/`
- Build artifacts

## Summary

**Total Project Files**: 20+ files
**TypeScript Files**: 8+ files
**React Components**: 4 components
**Configuration Files**: 5 files
**Documentation**: 4 files
**Data Files**: 2+ sample markdown files
