'use client';

import { useState } from 'react';

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  htmlContent: string;
  defaultOpen?: boolean;
}

export function AccordionSection({ title, icon, htmlContent, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!htmlContent) return null;

  return (
    <div className="border border-[rgba(107,83,68,0.12)] rounded-[10px] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#faf8f5] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#8a7d6b]">{icon}</span>
          <span className="text-sm font-medium text-[#3d3428]">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-[#8a7d6b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-white border-t border-[rgba(107,83,68,0.08)]">
          <div
            className="prose-content text-sm text-[#3d3428] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
}
