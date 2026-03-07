import Image from 'next/image';
import { getTodayQuote, getAllQuotes, formatDateString } from '@/lib/quotes';
import { markdownToHtml } from '@/lib/markdown';
import { AccordionSection } from '@/components/AccordionSection';
import { Calendar } from '@/components/Calendar';

export const revalidate = 86400;

// アコーディオン用アイコン
const ScrollTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);
const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
      <div style={{ maxWidth: '992px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
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
    <div style={{ maxWidth: '992px', margin: '0 auto' }}>

      {/* ===== メインカード（Figma忠実再現） ===== */}
      {/* 肖像画がカード上端にまたがるため position: relative コンテナ。padding無しで992px全幅 */}
      <div style={{ position: 'relative', paddingTop: '64px', marginBottom: '24px' }}>
        {/* 肖像画（カード上端に重なる） */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          borderRadius: '9999px',
          overflow: 'hidden',
          border: '4px solid #fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          zIndex: 10,
          backgroundColor: '#fff',
          padding: '4px',
        }}>
          <div style={{ borderRadius: '9999px', overflow: 'hidden', width: '100%', height: '100%' }}>
            <Image src="/sontoku-portrait.png" alt="二宮尊徳" width={112} height={112} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* メインカード本体 */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid rgba(107,83,68,0.15)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', minHeight: '432px' }}>
            {/* 左カラム：ベージュ背景・日付・タイトル */}
            <div style={{
              flex: '1',
              backgroundColor: '#f7f3ee',
              borderRight: '1px solid rgba(107,83,68,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              minHeight: '432px',
            }}>
              <div style={{ textAlign: 'center' }}>
                {/* 日付表示 */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '16px', color: '#8a7d6b', lineHeight: '24px' }}>{quote.month}月</span>
                  <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '56px', color: '#6b5344', lineHeight: '56px', fontWeight: 400 }}>{quote.day}</span>
                  <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '16px', color: '#8a7d6b', lineHeight: '24px' }}>日</span>
                </div>

                {/* 区切り線 */}
                <div style={{ width: '64px', height: '1px', backgroundColor: 'rgba(107,83,68,0.3)', margin: '0 auto 16px' }} />

                {/* タイトル */}
                <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '24px', fontWeight: 500, color: '#6b5344', lineHeight: '32px', marginBottom: '16px' }}>
                  {quote.frontmatter.title}
                </h1>

                {/* 区切り線 */}
                <div style={{ width: '64px', height: '1px', backgroundColor: 'rgba(107,83,68,0.3)', margin: '0 auto 16px' }} />

                {/* タグとボタン */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: 'rgba(107,83,68,0.1)',
                    borderRadius: '9999px',
                    padding: '4px 16px',
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: '16px',
                    color: '#6b5344',
                    lineHeight: '24px',
                  }}>
                    {dateString}の一言
                  </span>
                </div>
              </div>
            </div>

            {/* 右カラム：書籍画像（白背景） */}
            {quote.imagePath ? (
              <div style={{
                flex: '1',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                minHeight: '432px',
              }}>
                <div style={{ borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: '362px', width: '100%' }}>
                  <Image
                    src={quote.imagePath}
                    alt={`${quote.frontmatter.title} 書籍スクリーンショット`}
                    width={362}
                    height={400}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div style={{ flex: '1', backgroundColor: '#fff', minHeight: '432px' }} />
            )}
          </div>
        </div>
      </div>

      {/* ===== 以下はpadding付きで表示 ===== */}
      <div style={{ padding: '0 0 2.5rem' }}>
        {/* 現代語訳カード */}
        {gengoHtml && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(107,83,68,0.15)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)',
            padding: '33px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '24px', height: '1px', backgroundColor: 'rgba(107,83,68,0.3)' }} />
              <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '16px', color: 'rgba(107,83,68,0.6)', whiteSpace: 'nowrap' }}>現代語訳</span>
              <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(107,83,68,0.3)' }} />
            </div>
            <div
              className="prose-content"
              style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '16px', color: '#3d3428', lineHeight: '32px' }}
              dangerouslySetInnerHTML={{ __html: gengoHtml }}
            />
            <p style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '16px', color: 'rgba(138,125,107,0.6)', marginTop: '16px' }}>
              出典：二宮尊徳一日一言 致知出版社
            </p>
          </div>
        )}

        {/* アコーディオンセクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
          <AccordionSection title="原文" icon={<ScrollTextIcon />} htmlContent={genbuHtml} />
          <AccordionSection title="語句解説" icon={<BookOpenIcon />} htmlContent={gogakuHtml} />
          <AccordionSection title="補足・背景" icon={<MessageIcon />} htmlContent={hosokuHtml} />
          <AccordionSection title="仕事／暮らしへの示唆" icon={<LightbulbIcon />} htmlContent={shisaHtml} />
        </div>

        {/* カレンダー */}
        <Calendar quotes={calendarQuotes} todayMonth={todayMonth} todayDay={todayDay} />
      </div>
    </div>
  );
}
