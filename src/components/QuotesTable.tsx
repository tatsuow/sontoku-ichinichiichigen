'use client';

import { useState, useMemo, useEffect } from 'react';
import { Quote } from '@/types/quote';

interface QuotesTableProps {
  quotes: Quote[];
}

export function QuotesTable({ quotes: initialQuotes }: QuotesTableProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 初期値はSSR安全な値、useEffectでクライアントの今月・年に上書き
  const [filterMonth, setFilterMonth] = useState<number | 'all'>(1);
  const [calYear, setCalYear] = useState(2026);
  useEffect(() => {
    const now = new Date();
    setFilterMonth(now.getMonth() + 1);
    setCalYear(now.getFullYear());
  }, []);

  const filteredQuotes = useMemo(() => {
    const filtered = filterMonth === 'all'
      ? [...quotes]
      : quotes.filter((q) => q.month === filterMonth);
    return filtered.sort((a, b) => {
      if (a.month !== b.month) return b.month - a.month;
      return b.day - a.day;
    });
  }, [quotes, filterMonth]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」（${id}）を削除しますか？\nGitHubからMDファイルと画像が削除されます。`)) return;

    const githubToken = localStorage.getItem('github-token');
    if (!githubToken) {
      alert('GitHubトークンが設定されていません。上部のAPI設定でトークンを保存してください。');
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch('/api/delete-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-GitHub-Token': githubToken,
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (!result.success) {
        alert(`削除に失敗しました: ${result.error}`);
        return;
      }
      // ローカル一覧からも除去
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      alert(`「${title}」を削除しました。Vercelが自動デプロイします。`);
    } catch (err) {
      alert(`削除中にエラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownloadMd = (quote: Quote) => {
    const datePrefix = `${calYear}-${String(quote.month).padStart(2, '0')}-${String(quote.day).padStart(2, '0')}`;
    const safeTitle = quote.frontmatter.title || '無題';
    const mdContent = `---
title: ${datePrefix}_${safeTitle}
source: ${quote.frontmatter.source || '二宮尊徳一日一言　致知出版社'}
tags:
  - 二宮尊徳
---

## 原文
${quote.content.原文 || ''}

## 現代語訳
${quote.content.現代語訳 || ''}

## 語句解説
${quote.content.語句解説 || ''}

## 補足・背景
${quote.content.補足背景 || ''}

## 仕事／暮らしへの示唆
${quote.content.示唆 || ''}
`;
    const blob = new Blob([mdContent], { type: 'text/markdown; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datePrefix}_${safeTitle}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-[14px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] p-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-[#3d3428]" style={{ marginBottom: '12px' }}>
          登録済みリスト（{filteredQuotes.length}件）
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' }}>
          <button
            onClick={() => setFilterMonth('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: filterMonth === 'all' ? '2px solid #6b5344' : '1px solid transparent',
              backgroundColor: filterMonth === 'all' ? '#6b5344' : 'transparent',
              color: filterMonth === 'all' ? '#fff' : '#8a7d6b',
              fontWeight: filterMonth === 'all' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            全て
          </button>
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setFilterMonth(m)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: filterMonth === m ? '2px solid #6b5344' : '1px solid transparent',
                backgroundColor: filterMonth === m ? '#6b5344' : 'transparent',
                color: filterMonth === m ? '#fff' : '#8a7d6b',
                fontWeight: filterMonth === m ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {m}月
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(107,83,68,0.15)]">
              <th className="text-left px-4 py-3 font-medium text-[#3d3428]">
                日付
              </th>
              <th className="text-left px-4 py-3 font-medium text-[#3d3428]">
                タイトル
              </th>
              <th className="text-center px-4 py-3 font-medium text-[#3d3428]">
                詳細
              </th>
              <th className="text-center px-4 py-3 font-medium text-[#3d3428]">
                画像
              </th>
              <th className="text-center px-4 py-3 font-medium text-[#3d3428]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-b border-[rgba(107,83,68,0.15)] hover:bg-[#f5f1ec] transition-colors"
                >
                  <td className="px-4 py-3 text-[#3d3428]">
                    {quote.month}月{quote.day}日
                  </td>
                  <td className="px-4 py-3 text-[#3d3428]">
                    {quote.frontmatter.title}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[#8a7d6b]">
                      {quote.content.原文 ? 'あり' : 'なし'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={quote.imagePath ? 'text-[#6b5344] font-medium' : 'text-[#8a7d6b]'}>
                      {quote.imagePath ? 'あり' : 'なし'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleDownloadMd(quote)}
                      className="p-2 hover:bg-[#f5f1ec] rounded transition-colors"
                      title="MDダウンロード"
                    >
                      <svg
                        className="w-4 h-4 text-[#6b5344]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id, quote.frontmatter.title)}
                      disabled={deleting === quote.id}
                      className="p-2 hover:bg-red-100 rounded transition-colors"
                      title="削除"
                      style={{ opacity: deleting === quote.id ? 0.4 : 1 }}
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#8a7d6b]">
                  登録済みのデータはありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
