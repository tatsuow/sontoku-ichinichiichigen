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
    <div style={{
      border: '1px solid rgba(107,83,68,0.15)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 20px',
          height: '52px',
          backgroundColor: 'rgba(240,235,228,0.2)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ width: '20px', height: '20px', color: '#8a7d6b', flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{
          flex: 1,
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '24px',
          color: '#3d3428',
        }}>
          {title}
        </span>
        <svg
          style={{
            width: '20px',
            height: '20px',
            color: '#b0a696',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ padding: '16px 20px 20px', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <div
            className="prose-content"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '15px',
              color: '#3d3428',
              lineHeight: '28px',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
}
