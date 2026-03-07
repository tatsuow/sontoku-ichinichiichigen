export interface QuoteFrontmatter {
  title: string;
  source: string;
  tags: string[];
}

export interface QuoteContent {
  raw: string;
  原文?: string;
  現代語訳?: string;
  語句解説?: string;
  補足背景?: string;
  示唆?: string;
}

export interface Quote {
  id: string;
  month: number;
  day: number;
  frontmatter: QuoteFrontmatter;
  content: QuoteContent;
  slug: string;
  imagePath: string | null;
}

export interface QuoteListItem {
  date: string; // YYYY-MM-DD
  month: number;
  day: number;
  title: string;
  slug: string;
  hasImage: boolean;
  hasDetails: boolean;
}
