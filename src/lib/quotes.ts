import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Quote, QuoteFrontmatter, QuoteContent } from '@/types/quote';

const dataDir = path.join(process.cwd(), 'data');
const imagesDir = path.join(process.cwd(), 'public', 'images');

// Build a map of "MM-DD" -> image filename from public/images/
function buildImageMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(imagesDir)) return map;
  const files = fs.readdirSync(imagesDir);
  for (const f of files) {
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})\.(jpg|jpeg|png)$/i);
    if (m) {
      const key = `${m[2]}-${m[3]}`; // MM-DD
      map.set(key, f);
    }
  }
  return map;
}

const imageMap = buildImageMap();

function mapSectionName(name: string): keyof QuoteContent | null {
  if (name === '原文') return '原文';
  if (name === '現代語訳') return '現代語訳';
  if (name === '語句解説') return '語句解説';
  if (name.includes('補足') || name.includes('背景')) return '補足背景';
  if (name.includes('示唆') || name.includes('仕事') || name.includes('暮らし')) return '示唆';
  return null;
}

function parseMarkdownContent(content: string): QuoteContent {
  const sections: QuoteContent = {
    raw: content,
  };

  const lines = content.split('\n');
  let currentSection: keyof QuoteContent | null = null;
  let currentContent = '';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection && currentContent) {
        sections[currentSection] = currentContent.trim();
      }
      currentSection = mapSectionName(line.replace('## ', '').trim());
      currentContent = '';
    } else if (currentSection) {
      currentContent += line + '\n';
    }
  }

  if (currentSection && currentContent) {
    sections[currentSection] = currentContent.trim();
  }

  return sections;
}

function extractDateFromFilename(filename: string): { month: number; day: number } | null {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return {
      month: parseInt(match[2], 10),
      day: parseInt(match[3], 10),
    };
  }
  return null;
}

export async function getAllQuotes(): Promise<Quote[]> {
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.md'));

  const quotes: Quote[] = files
    .map((file) => {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      let content: string;
      try {
        const parsed = matter(fileContent);
        data = parsed.data;
        content = parsed.content;
      } catch {
        // Skip files with malformed YAML frontmatter
        console.warn(`Skipping file with invalid frontmatter: ${file}`);
        return null;
      }
      const dateInfo = extractDateFromFilename(file);

      if (!dateInfo) {
        return null;
      }

      const frontmatter = data as QuoteFrontmatter;

      if (
        !frontmatter.source ||
        !frontmatter.source.includes('二宮尊徳一日一言')
      ) {
        return null;
      }

      // Extract clean title (remove date prefix like "2026-03-06_")
      const cleanTitle = frontmatter.title
        ? frontmatter.title.replace(/^\d{4}-\d{2}-\d{2}_/, '')
        : file.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/\.md$/, '');

      const parsedContent = parseMarkdownContent(content);

      // Look up image: key = "MM-DD"
      const imgKey = `${String(dateInfo.month).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
      const imageFile = imageMap.get(imgKey);
      const imagePath = imageFile ? `/images/${imageFile}` : null;

      return {
        id: file.replace('.md', ''),
        month: dateInfo.month,
        day: dateInfo.day,
        frontmatter: { ...frontmatter, title: cleanTitle },
        content: parsedContent,
        slug: file.replace('.md', ''),
        imagePath,
      };
    })
    .filter((quote): quote is Quote => quote !== null)
    .sort((a, b) => {
      if (a.month !== b.month) {
        return a.month - b.month;
      }
      return a.day - b.day;
    });

  return quotes;
}

export async function getQuoteByDate(
  month: number,
  day: number
): Promise<Quote | null> {
  const quotes = await getAllQuotes();
  return quotes.find((q) => q.month === month && q.day === day) || null;
}

export async function getTodayQuote(): Promise<Quote | null> {
  // Vercelサーバーはutcなので、JSTで「今日」を取得
  const now = new Date();
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const month = jst.getMonth() + 1;
  const day = jst.getDate();
  return getQuoteByDate(month, day);
}

export function formatDateString(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function formatMonthDayString(month: number, day: number): string {
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
