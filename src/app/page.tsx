import Image from 'next/image';
import { getTodayQuote, formatDateString } from '@/lib/quotes';
import { markdownToHtml } from '@/lib/markdown';

export const revalidate = 86400; // Revalidate once per day at midnight

export default async function Home() {
  const quote = await getTodayQuote();

  if (!quote) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#3d3428]">
            二宮尊徳一日一言
          </h1>
          <p className="text-[#8a7d6b]">
            本日の言葉はまだ登録されていません
          </p>
        </div>
      </div>
    );
  }

  const dateString = formatDateString(quote.month, quote.day);

  // マークダウンを各セクションでHTMLに変換
  const [gengoHtml, gogakuHtml, hosokuHtml, shisaHtml] = await Promise.all([
    quote.content.現代語訳 ? markdownToHtml(quote.content.現代語訳) : Promise.resolve(''),
    quote.content.語句解説 ? markdownToHtml(quote.content.語句解説) : Promise.resolve(''),
    quote.content.補足背景 ? markdownToHtml(quote.content.補足背景) : Promise.resolve(''),
    quote.content.示唆 ? markdownToHtml(quote.content.示唆) : Promise.resolve(''),
  ]);

  // 原文はブロック引用（> ）を含む場合があるのでHTMLに変換
  const genbuHtml = quote.content.原文 ? await markdownToHtml(quote.content.原文) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3d3428] mb-2">
          二宮尊徳一日一言
        </h1>
        <p className="text-lg text-[#8a7d6b]">{dateString}</p>
      </div>

      {/* Quote Card */}
      <div className="bg-white rounded-[14px] shadow-[0px_2px_8px_rgba(0,0,0,0.12),0px_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-8 mb-8">
        {/* Title */}
        <div className="text-center border-b border-[rgba(107,83,68,0.15)] pb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#3d3428]">
            {quote.frontmatter.title}
          </h2>
        </div>

        {/* 書籍スクリーンショット */}
        {quote.imagePath && (
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm rounded-[10px] overflow-hidden border border-[rgba(107,83,68,0.15)]">
              <Image
                src={quote.imagePath}
                alt={`${quote.frontmatter.title} 書籍スクリーンショット`}
                width={400}
                height={300}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        )}

        {/* 原文 */}
        {genbuHtml && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#8a7d6b] uppercase tracking-widest border-b border-[rgba(107,83,68,0.1)] pb-1">
              原文
            </h3>
            <div
              className="prose-quote text-base leading-relaxed text-[#3d3428]"
              dangerouslySetInnerHTML={{ __html: genbuHtml }}
            />
          </div>
        )}

        {/* 現代語訳 */}
        {gengoHtml && (
          <div className="space-y-2 bg-[#f5f1ec] p-5 rounded-[10px]">
            <h3 className="text-xs font-semibold text-[#8a7d6b] uppercase tracking-widest border-b border-[rgba(107,83,68,0.1)] pb-1 mb-3">
              現代語訳
            </h3>
            <div
              className="prose-content text-base leading-relaxed text-[#3d3428]"
              dangerouslySetInnerHTML={{ __html: gengoHtml }}
            />
          </div>
        )}

        {/* 語句解説 */}
        {gogakuHtml && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#8a7d6b] uppercase tracking-widest border-b border-[rgba(107,83,68,0.1)] pb-1 mb-3">
              語句解説
            </h3>
            <div
              className="prose-content text-sm text-[#3d3428]"
              dangerouslySetInnerHTML={{ __html: gogakuHtml }}
            />
          </div>
        )}

        {/* 補足・背景 */}
        {hosokuHtml && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#8a7d6b] uppercase tracking-widest border-b border-[rgba(107,83,68,0.1)] pb-1 mb-3">
              補足・背景
            </h3>
            <div
              className="prose-content text-sm leading-relaxed text-[#3d3428]"
              dangerouslySetInnerHTML={{ __html: hosokuHtml }}
            />
          </div>
        )}

        {/* 示唆 */}
        {shisaHtml && (
          <div className="space-y-2 border-l-4 border-[#6b5344] pl-4 bg-[#faf8f5] py-3 rounded-r-[10px]">
            <h3 className="text-xs font-semibold text-[#8a7d6b] uppercase tracking-widest border-b border-[rgba(107,83,68,0.1)] pb-1 mb-3">
              仕事／暮らしへの示唆等
            </h3>
            <div
              className="prose-content text-sm leading-relaxed text-[#3d3428]"
              dangerouslySetInnerHTML={{ __html: shisaHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
