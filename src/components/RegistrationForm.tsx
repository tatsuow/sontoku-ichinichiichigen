'use client';

import { useState } from 'react';

interface FormData {
  month: number;
  day: number;
  title: string;
  modernTranslation: string;
  originalText: string;
  glossary: string;
  background: string;
  implication: string;
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    month: 1,
    day: 1,
    title: '',
    modernTranslation: '',
    originalText: '',
    glossary: '',
    background: '',
    implication: '',
  });

  const [expandDetails, setExpandDetails] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'month' || name === 'day' ? parseInt(value) : value,
    }));
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('登録機能はクライアント側のUIデモです。');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[14px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] p-6 space-y-6">
      <h3 className="text-lg font-medium text-[#3d3428]">新規登録</h3>

      {/* Step 1: Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#3d3428]">
          Step 1: 書籍スクリーンショット
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
          className="border-2 border-dashed border-[rgba(107,83,68,0.15)] rounded-[14px] p-8 text-center cursor-pointer hover:bg-[#f5f1ec] transition-colors"
        >
          {uploadedImage ? (
            <div className="space-y-2">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="h-32 mx-auto object-cover rounded-[14px]"
              />
              <p className="text-sm text-[#8a7d6b]">
                クリックで別の画像を選択
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="text-xs text-[#6b5344] cursor-pointer hover:underline"
              >
                画像を変更
              </label>
            </div>
          ) : (
            <div>
              <svg
                className="w-8 h-8 mx-auto text-[#8a7d6b] mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-[#3d3428] font-medium">
                画像をここにドラッグ＆ドロップ
              </p>
              <p className="text-sm text-[#8a7d6b] mt-1">
                またはクリックして選択
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <span className="text-[#6b5344] text-sm hover:underline">
                  ファイルを選択
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Analysis Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#3d3428]">
          Step 2: 解説データの取得
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            className="flex-1 px-4 py-3 rounded-[10px] font-medium text-white bg-gradient-to-r from-[#7f22fe] to-[#4f39f6] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            AIで自動解析
          </button>
          <button
            type="button"
            onClick={() => {
              /* Handle MD file import */
            }}
            className="flex-1 px-4 py-3 rounded-[10px] font-medium text-[#3d3428] bg-[#f5f1ec] hover:bg-opacity-80 transition-colors"
          >
            MDファイルを読み込み
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(107,83,68,0.15)]"></div>

      {/* Step 3: Basic Info */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-[#3d3428]">
          Step 3: 基本情報（確認・編集）
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8a7d6b] mb-2 block">
              月
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}月
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8a7d6b] mb-2 block">
              日
            </label>
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}日
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#8a7d6b] mb-2 block">
            タイトル
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20"
            placeholder="e.g. 至誠神の如し"
          />
        </div>

        <div>
          <label className="text-xs text-[#8a7d6b] mb-2 block">
            現代語訳
          </label>
          <textarea
            name="modernTranslation"
            value={formData.modernTranslation}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20 resize-none"
            placeholder="現代語訳をここに入力"
          ></textarea>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border border-[rgba(107,83,68,0.15)] rounded-[14px] overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandDetails(!expandDetails)}
          className="w-full px-4 py-3 flex items-center justify-between bg-[#f5f1ec] hover:bg-opacity-80 transition-colors"
        >
          <label className="text-sm font-medium text-[#3d3428] cursor-pointer">
            詳細フィールド（原文・語句解説・補足/背景・示唆）
          </label>
          <svg
            className={`w-5 h-5 transition-transform ${
              expandDetails ? 'rotate-180' : ''
            }`}
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

        {expandDetails && (
          <div className="px-4 py-4 border-t border-[rgba(107,83,68,0.15)] space-y-4">
            <div>
              <label className="text-xs text-[#8a7d6b] mb-2 block">
                原文
              </label>
              <textarea
                name="originalText"
                value={formData.originalText}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20 resize-none"
                placeholder="原文をここに入力"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-[#8a7d6b] mb-2 block">
                語句解説
              </label>
              <textarea
                name="glossary"
                value={formData.glossary}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20 resize-none"
                placeholder="語句解説をここに入力"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-[#8a7d6b] mb-2 block">
                補足・背景
              </label>
              <textarea
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20 resize-none"
                placeholder="補足・背景をここに入力"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-[#8a7d6b] mb-2 block">
                仕事／暮らしへの示唆等
              </label>
              <textarea
                name="implication"
                value={formData.implication}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] bg-[#f5f1ec] border border-[rgba(107,83,68,0.15)] placeholder:text-[#8a7d6b] focus:outline-none focus:ring-2 focus:ring-[#6b5344] focus:ring-opacity-20 resize-none"
                placeholder="示唆をここに入力"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-[#6b5344] rounded-[10px] text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formData.month}月{formData.day}日を登録
      </button>
    </form>
  );
}
