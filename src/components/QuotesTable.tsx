'use client';

import { useState, useMemo } from 'react';
import { Quote } from '@/types/quote';

interface QuotesTableProps {
  quotes: Quote[];
}

export function QuotesTable({ quotes }: QuotesTableProps) {
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');

  const filteredQuotes = useMemo(() => {
    if (filterMonth === 'all') {
      return quotes;
    }
    return quotes.filter((q) => q.month === filterMonth);
  }, [quotes, filterMonth]);

  const handleDelete = (id: string) => {
    if (confirm(`本当に「${id}」を削除しますか？`)) {
      console.log('Delete:', id);
      alert('削除機能はクライアント側のUIデモです。');
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit:', id);
    alert('編集機能はクライアント側のUIデモです。');
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-[14px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#3d3428]">
          登録済みリスト（{filteredQuotes.length}件）
        </h3>
        <select
          value={filterMonth}
          onChange={(e) => {
            const val = e.target.value;
            setFilterMonth(val === 'all' ? 'all' : parseInt(val));
          }}
          className="max-w-xs px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20"
        >
          <option value="all">すべての月</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}月
            </option>
          ))}
        </select>
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
                      onClick={() => handleEdit(quote.id)}
                      className="p-2 hover:bg-[#f5f1ec] rounded transition-colors"
                      title="編集"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="p-2 hover:bg-red-100 rounded transition-colors"
                      title="削除"
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
