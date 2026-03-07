import Image from 'next/image';
import { getTodayQuote, getAllQuotes, formatDateString } from '@/lib/quotes';
import { markdownToHtml } from '@/lib/markdown';
import { AccordionSection } from '@/components/AccordionSection';
import { Calendar } from '@/components/Calendar';

export const revalidate = 86400;

// アコーディオン用アイコン
const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export default async function Home() {
  const [quote, allQuotes] = await Promise.all([
    getTodayQuote(),
    getAllQuotes(),
  ]);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const calendarQuotes = allQuotes.map((q) => ({
    month: q.month,
    day: q.day,
    title: q.frontmatter.title,
  }));

  if (!quote) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div className="text-center">
          <p className="text-[#8a7d6b]">本日（{todayMonth}月{todayDay}日）の言葉はまだ登録されていません</p>
        </div>
        <Calendar quotes={calendarQuotes} todayMonth={todayMonth} todayDay={todayDay} />
      </div>
    );
  }

  const dateString = formatDateString(quote.month, quote.day);

  const [genbuHtml, gengoHtml, gogakuHtml, hosokuHtml, shisaHtml] = await Promise.all([
    quote.content.原文 ? markdownToHtml(quote.content.原文) : Promise.resolve(''),
    quote.content.現代語訳 ? markdownToHtml(quote.content.現代語訳) : Promise.resolve(''),
    quote.content.語句解説 ? markdownToHtml(quote.content.語句解説) : Promise.resolve(''),
    quote.content.補足背景 ? markdownToHtml(quote.content.補足背景) : Promise.resolve(''),
    quote.content.示唆 ? markdownToHtml(quote.content.示唆) : Promise.resolve(''),
  ]);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* ===== メインカード ===== */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(61,52,40,0.10), 0 1px 4px rgba(61,52,40,0.06)', overflow: 'hidden', marginBottom: '2rem' }}>

        {/* 上段：肖像画を中央に配置 */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '0.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(107,83,68,0.15)', boxShadow: '0 2px 12px rgba(61,52,40,0.1)' }}>
            <Image
              src="/sontoku-portrait.png"
              alt="二宮尊徳"
              width={80}
              height={80}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 2カラム：左に日付・タイトル、右に書籍画像 */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* 左カラム：日付とタイトル */}
          <div style={{ flex: '1', minWidth: '280px', padding: '1rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="mb-4">
              <span className="text-5xl font-bold text-[#3d3428] leading-none">{quote.month}月</span>
              <span className="text-7xl font-bold text-[#3d3428] leading-none ml-1">{quote.day}</span>
              <span className="text-2xl text-[#8a7d6b] ml-1">日</span>
            </div>
            <div style={{ width: '4rem', height: '2px', backgroundColor: 'rgba(107,83,68,0.2)', marginBottom: '1rem' }} />
            <h1 className="text-2xl md:text-3xl font-bold text-[#3d3428] leading-snug mb-5">
              {quote.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#f5f1ec] text-sm text-[#6b5344] font-medium border border-[rgba(107,83,68,0.12)]">
                {dateString}の一言
              </span>
            </div>
          </div>

          {/* 右カラム：書籍画像 */}
          {quote.imagePath && (
            <div style={{ width: '280px', flexShrink: 0, background: 'linear-gradient(to bottom, #f5f1ec, #ede7df)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(61,52,40,0.15)' }}>
                <Image
                  src={quote.imagePath}
                  alt={`${quote.frontmatter.title} 書籍スクリーンショット`}
                  width={240}
                  height={320}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 現代語訳カード（常時展開） ===== */}
      {gengoHtml && (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(61,52,40,0.06), 0 1px 3px rgba(61,52,40,0.04)', padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ height: '1px', flex: '1', backgroundColor: 'rgba(107,83,68,0.12)' }} />
            <span className="text-xs font-bold text-[#8a7d6b] tracking-[0.2em] uppercase">現代語訳</span>
            <div style={{ height: '1px', flex: '1', backgroundColor: 'rgba(107,83,68,0.12)' }} />
          </div>
          <div
            className="prose-content text-[15px] text-[#3d3428] leading-[1.9]"
            dangerouslySetInnerHTML={{ __html: gengoHtml }}
          />
          <p style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(107,83,68,0.08)', fontSize: '0.75rem', color: '#b0a696', textAlign: 'center' }}>
            出典：二宮尊徳一日一言　致知出版社
          </p>
        </div>
      )}

      {/* ===== アコーディオンセクション ===== */}
      <div className="space-y-3 mb-8">
        <AccordionSection title="原文" icon={<BookIcon />} htmlContent={genbuHtml} />
        <AccordionSection title="語句解説" icon={<GridIcon />} htmlContent={gogakuHtml} />
        <AccordionSection title="補足・背景" icon={<ChatIcon />} htmlContent={hosokuHtml} />
        <AccordionSection title="仕事／暮らしへの示唆" icon={<LightbulbIcon />} htmlContent={shisaHtml} />
      </div>

      {/* ===== カレンダー ===== */}
      <Calendar quotes={calendarQuotes} todayMonth={todayMonth} todayDay={todayDay} />
    </div>
  );
}
