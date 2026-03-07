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
    <div className="bg-white rounded-[12px] shadow-[0_1px_4px_rgba(61,52,40,0.06)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#faf8f5] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#f5f1ec] flex items-center justify-center text-[#8a7d6b]">
            {icon}
          </span>
          <span className="text-sm font-semibold text-[#3d3428]">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-[#b0a696] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-1">
          <div className="pl-10">
            <div
              className="prose-content text-sm text-[#3d3428] leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
