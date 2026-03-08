'use client';

import { useState, useCallback } from 'react';

interface FormData {
  month: number;
  day: number;
  title: string;
  originalText: string;
  modernTranslation: string;
  glossary: string;
  background: string;
  implication: string;
}

type Status = 'idle' | 'analyzing' | 'saving' | 'saved' | 'error';

export function RegistrationForm() {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini-api-key') || '';
    }
    return '';
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    month: 1,
    day: 1,
    title: '',
    originalText: '',
    modernTranslation: '',
    glossary: '',
    background: '',
    implication: '',
  });

  // APIキー保存
  const handleSaveApiKey = () => {
    localStorage.setItem('gemini-api-key', apiKey);
    setSuccessMessage('APIキーを保存しました');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
  };

  // 画像アップロード
  const handleImageFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  // フォーム入力
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'month' || name === 'day' ? parseInt(value) : value,
    }));
  };

  // AI解析
  const handleAnalyze = async () => {
    if (!apiKey) {
      setErrorMessage('Gemini APIキーを入力してください');
      return;
    }
    if (!uploadedImage) {
      setErrorMessage('画像をアップロードしてください');
      return;
    }

    setStatus('analyzing');
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ image: uploadedImage }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || '解析に失敗しました');
      }

      const d = result.data;
      setFormData({
        month: d.month || 1,
        day: d.day || 1,
        title: d.title || '',
        originalText: (d.originalText || '').replace(/\\n/g, '\n'),
        modernTranslation: (d.modernTranslation || '').replace(/\\n/g, '\n'),
        glossary: (d.glossary || '').replace(/\\n/g, '\n'),
        background: (d.background || '').replace(/\\n/g, '\n'),
        implication: (d.implication || '').replace(/\\n/g, '\n'),
      });

      setStatus('idle');
      setSuccessMessage('AI解析が完了しました。内容を確認・編集して登録してください。');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '解析に失敗しました');
    }
  };

  // 保存
  const handleSave = async () => {
    if (!formData.title) {
      setErrorMessage('タイトルは必須です');
      return;
    }

    setStatus('saving');
    setErrorMessage('');

    try {
      const res = await fetch('/api/save-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageData: uploadedImage,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || '保存に失敗しました');
      }

      setStatus('saved');
      setSuccessMessage(
        `${formData.month}月${formData.day}日「${formData.title}」を保存しました（${result.filename}）`
      );

      // フォームリセット
      setFormData({
        month: 1,
        day: 1,
        title: '',
        originalText: '',
        modernTranslation: '',
        glossary: '',
        background: '',
        implication: '',
      });
      setUploadedImage(null);

      setTimeout(() => {
        setStatus('idle');
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  const isAnalyzing = status === 'analyzing';
  const isSaving = status === 'saving';
  const canAnalyze = !!apiKey && !!uploadedImage && !isAnalyzing && !isSaving;
  const canSave = !!formData.title && !isAnalyzing && !isSaving;

  // 共通スタイル
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    backgroundColor: '#f5f1ec',
    border: '1px solid rgba(107,83,68,0.15)',
    fontSize: '14px',
    color: '#3d3428',
    outline: 'none',
    fontFamily: "'Noto Serif JP', serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    color: '#8a7d6b',
    marginBottom: '6px',
    fontWeight: 500,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ===== APIキー設定 ===== */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        border: '1px solid rgba(107,83,68,0.15)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <svg style={{ width: '18px', height: '18px', color: '#8a7d6b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#3d3428' }}>Gemini APIキー</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Google Gemini APIキーを入力"
              style={inputStyle}
            />
          </div>
          <button
            type="button"
            onClick={handleSaveApiKey}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: '#6b5344',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            保存
          </button>
          {apiKey && (
            <button
              type="button"
              onClick={handleClearApiKey}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: '#f5f1ec',
                color: '#6b5344',
                border: '1px solid rgba(107,83,68,0.15)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              クリア
            </button>
          )}
        </div>
        <p style={{ fontSize: '11px', color: '#8a7d6b', marginTop: '8px' }}>
          APIキーはブラウザのlocalStorageに保存されます（サーバーには送信されません）
        </p>
      </div>

      {/* ===== メインフォーム ===== */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        border: '1px solid rgba(107,83,68,0.15)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3d3428', marginBottom: '20px' }}>
          新規登録
        </h3>

        {/* ステータスメッセージ */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {successMessage}
          </div>
        )}

        {/* Step 1: 画像アップロード */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Step 1: 書籍スクリーンショット</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
            onClick={() => document.getElementById('image-input')?.click()}
            style={{
              border: '2px dashed rgba(107,83,68,0.2)',
              borderRadius: '14px',
              padding: uploadedImage ? '12px' : '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: uploadedImage ? '#fff' : '#faf8f5',
              transition: 'background-color 0.2s',
            }}
          >
            {uploadedImage ? (
              <div>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '10px', display: 'block' }}
                />
                <p style={{ fontSize: '12px', color: '#8a7d6b', marginTop: '8px' }}>
                  クリックで別の画像を選択
                </p>
              </div>
            ) : (
              <div>
                <svg style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: '#8a7d6b', display: 'block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p style={{ fontWeight: 500, color: '#3d3428', fontSize: '14px' }}>
                  画像をドラッグ＆ドロップ
                </p>
                <p style={{ fontSize: '12px', color: '#8a7d6b', marginTop: '4px' }}>
                  またはクリックしてファイルを選択
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              id="image-input"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Step 2: AI解析ボタン */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Step 2: AI自動解析</label>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              background: canAnalyze
                ? 'linear-gradient(135deg, #7f22fe, #4f39f6)'
                : 'rgba(107,83,68,0.15)',
              color: canAnalyze ? '#fff' : '#8a7d6b',
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isAnalyzing ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                解析中...
              </>
            ) : (
              <>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Gemini AIで自動解析
              </>
            )}
          </button>
          {!apiKey && (
            <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>
              APIキーを上の欄に入力してください
            </p>
          )}
          {apiKey && !uploadedImage && (
            <p style={{ fontSize: '11px', color: '#8a7d6b', marginTop: '6px' }}>
              画像をアップロードすると解析ボタンが有効になります
            </p>
          )}
        </div>

        {/* 区切り線 */}
        <div style={{ height: '1px', backgroundColor: 'rgba(107,83,68,0.15)', margin: '0 0 20px' }} />

        {/* Step 3: フォームフィールド */}
        <div>
          <label style={labelStyle}>Step 3: 内容確認・編集</label>

          {/* 月・日 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>月</label>
              <select name="month" value={formData.month} onChange={handleInputChange} style={inputStyle}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>日</label>
              <select name="day" value={formData.day} onChange={handleInputChange} style={inputStyle}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>
          </div>

          {/* タイトル */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>タイトル</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="例: 至誠神の如し"
              style={inputStyle}
            />
          </div>

          {/* 原文 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>原文</label>
            <textarea
              name="originalText"
              value={formData.originalText}
              onChange={handleInputChange}
              rows={4}
              placeholder="書籍から抽出された原文"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* 現代語訳 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>現代語訳</label>
            <textarea
              name="modernTranslation"
              value={formData.modernTranslation}
              onChange={handleInputChange}
              rows={4}
              placeholder="AIが生成した現代語訳"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* 語句解説 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>語句解説</label>
            <textarea
              name="glossary"
              value={formData.glossary}
              onChange={handleInputChange}
              rows={3}
              placeholder="AIが生成した語句解説"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* 補足・背景 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>補足・背景</label>
            <textarea
              name="background"
              value={formData.background}
              onChange={handleInputChange}
              rows={3}
              placeholder="AIが生成した補足・背景情報"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* 示唆 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>仕事／暮らしへの示唆</label>
            <textarea
              name="implication"
              value={formData.implication}
              onChange={handleInputChange}
              rows={3}
              placeholder="AIが生成した示唆"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        {/* 登録ボタン */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: canSave ? '#6b5344' : 'rgba(107,83,68,0.15)',
            color: canSave ? '#fff' : '#8a7d6b',
            fontWeight: 600,
            fontSize: '15px',
            cursor: canSave ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.2s',
          }}
        >
          {isSaving ? '保存中...' : `${formData.month}月${formData.day}日「${formData.title || '---'}」を登録`}
        </button>
      </div>

      {/* スピナーアニメーション */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      ` }} />
    </div>
  );
}
