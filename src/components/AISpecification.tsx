'use client';

import { useState } from 'react';

export function AISpecification() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 border border-[rgba(107,83,68,0.15)] rounded-[14px] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-[#f5f1ec] hover:bg-opacity-80 transition-colors"
      >
        <h3 className="font-medium text-[#3d3428]">AI解析仕様書</h3>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-[rgba(107,83,68,0.15)] text-sm text-[#8a7d6b] space-y-3">
          <p>
            書籍のスクリーンショットをアップロードすると、AIがテキストを認識し、以下の項目を自動生成します：
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>原文：書籍から認識したテキスト</li>
            <li>現代語訳：原文を現代日本語に翻訳</li>
            <li>語句解説：難しい語句の説明</li>
            <li>補足・背景：歴史的背景や関連情報</li>
            <li>仕事／暮らしへの示唆等：実生活への応用</li>
          </ul>
          <p className="pt-2">
            生成されたデータはプレビューで確認し、必要に応じて手動で編集できます。
          </p>
        </div>
      )}
    </div>
  );
}
