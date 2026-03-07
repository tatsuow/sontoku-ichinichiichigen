'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CalendarQuote {
  month: number;
  day: number;
  title: string;
}

interface CalendarProps {
  quotes: CalendarQuote[];
  todayMonth: number;
  todayDay: number;
  selectedMonth?: number;
  selectedDay?: number;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function Calendar({ quotes, todayMonth, todayDay, selectedMonth, selectedDay }: CalendarProps) {
  const currentYear = new Date().getFullYear();
  // 選択された月がある場合はその月を表示、なければ今日の月
  const [displayMonth, setDisplayMonth] = useState(selectedMonth ?? todayMonth);

  // このmonthに登録されているquotesのマップ
  const quoteMap = new Map<number, string>();
  quotes
    .filter((q) => q.month === displayMonth)
    .forEach((q) => quoteMap.set(q.day, q.title));

  const monthCount = quotes.filter((q) => q.month === displayMonth).length;

  const daysInMonth = getDaysInMonth(currentYear, displayMonth);
  const firstDay = getFirstDayOfMonth(currentYear, displayMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handlePrevMonth = () => {
    setDisplayMonth((m) => (m === 1 ? 12 : m - 1));
  };
  const handleNextMonth = () => {
    setDisplayMonth((m) => (m === 12 ? 1 : m + 1));
  };

  return (
    <div className="mt-10 bg-white rounded-[14px] border border-[rgba(107,83,68,0.12)] overflow-hidden">
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(107,83,68,0.1)]">
        <h3 className="text-base font-semibold text-[#3d3428]">一日一言カレンダー</h3>
        <span className="text-xs text-[#8a7d6b]">この月：{monthCount}日分登録済み</span>
      </div>

      {/* 月ナビゲーション */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-[rgba(107,83,68,0.08)] overflow-x-auto">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded hover:bg-[#f5f1ec] text-[#8a7d6b] hover:text-[#3d3428] transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => setDisplayMonth(m)}
            className={`px-2.5 py-1 rounded text-xs font-medium flex-shrink-0 transition-colors ${
              displayMonth === m
                ? 'bg-[#6b5344] text-white'
                : 'text-[#8a7d6b] hover:bg-[#f5f1ec] hover:text-[#3d3428]'
            }`}
          >
            {m}月
          </button>
        ))}
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded hover:bg-[#f5f1ec] text-[#8a7d6b] hover:text-[#3d3428] transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* カレンダーグリッド */}
      <div className="p-4">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`text-center text-xs font-medium py-2 ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-[#8a7d6b]'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-16" />;
            }

            const isToday = day === todayDay && displayMonth === todayMonth;
            const isSelected = day === selectedDay && displayMonth === selectedMonth;
            const hasQuote = quoteMap.has(day);
            const quoteTitle = quoteMap.get(day);
            const weekday = (firstDay + day - 1) % 7;
            const isSunday = weekday === 0;
            const isSaturday = weekday === 6;

            return (
              <div
                key={day}
                className={`h-16 p-1 relative ${
                  hasQuote ? 'cursor-pointer hover:bg-[#faf8f5] rounded-[6px]' : ''
                } ${isSelected ? 'bg-[#f5f1ec] rounded-[6px] ring-2 ring-[#6b5344]' : isToday ? 'bg-[#f5f1ec] rounded-[6px]' : ''}`}
              >
                {hasQuote ? (
                  <Link href={`/quote/${displayMonth}/${day}`} className="block h-full">
                    <span
                      className={`block w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mx-auto mb-0.5 ${
                        isSelected
                          ? 'bg-[#6b5344] text-white'
                          : isToday
                          ? 'bg-[#6b5344] text-white'
                          : isSunday
                          ? 'text-red-400'
                          : isSaturday
                          ? 'text-blue-400'
                          : 'text-[#3d3428]'
                      }`}
                    >
                      {day}
                    </span>
                    <p className="text-[9px] text-[#8a7d6b] text-center leading-tight line-clamp-2 px-0.5">
                      {quoteTitle}
                    </p>
                  </Link>
                ) : (
                  <span
                    className={`block w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mx-auto ${
                      isToday
                        ? 'bg-[#6b5344] text-white'
                        : isSunday
                        ? 'text-red-400'
                        : isSaturday
                        ? 'text-blue-400'
                        : 'text-[rgba(61,52,40,0.4)]'
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
