'use client';

import { useState, useCallback, useEffect } from 'react';

interface FormData {
  title: string;
  originalText: string;
  modernTranslation: string;
  glossary: string;
  background: string;
  implication: string;
}

type Status = 'idle' | 'analyzing' | 'saving' | 'saved' | 'error';

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

// SSR/クライアント両方で安全な初期値（useEffectで上書きされる）
const INITIAL_FORM: FormData = {
  title: '',
  originalText: '',
  modernTranslation: '',
  glossary: '',
  background: '',
  implication: '',
};

export function RegistrationForm() {
  const [apiKey, setApiKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [mounted, setMounted] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  // カレンダー表示月・年（SSR安全な初期値、useEffectで上書き）
  const [calMonth, setCalMonth] = useState(1);
  const [calYear, setCalYear] = useState(2026);

  // 選択中の日（カレンダーの月とは別に管理）
  const [selectedDay, setSelectedDay] = useState(1);

  // クライアント側でのみ「今日」の日付とlocalStorageを読み込む
  useEffect(() => {
    setApiKey(localStorage.getItem('gemini-api-key') || '');
    setGithubToken(localStorage.getItem('github-token') || '');
    const now = new Date();
    setCalMonth(now.getMonth() + 1);
    setCalYear(now.getFullYear());
    setSelectedDay(now.getDate());
    setMounted(true);
  }, []);

  // トークン保存
  const handleSaveTokens = () => {
    localStorage.setItem('gemini-api-key', apiKey);
    localStorage.setItem('github-token', githubToken);
    setSuccessMessage('設定を保存しました');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleClearTokens = () => {
    localStorage.removeItem('gemini-api-key');
    localStorage.removeItem('github-token');
    setApiKey('');
    setGithubToken('');
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // カレンダーで日を選択
  const handleCalDaySelect = (d: number) => {
    setSelectedDay(d);
  };

  // カレンダー月移動（年もまたぐ）
  const handleCalPrev = () => {
    setCalMonth((m) => {
      if (m <= 1) { setCalYear((y) => y - 1); return 12; }
      return m - 1;
    });
  };
  const handleCalNext = () => {
    setCalMonth((m) => {
      if (m >= 12) { setCalYear((y) => y + 1); return 1; }
      return m + 1;
    });
  };

  // AI解析
  const handleAnalyze = async () => {
    if (!apiKey) { setErrorMessage('Gemini APIキーを入力してください'); return; }
    if (!uploadedImage) { setErrorMessage('画像をアップロードしてください'); return; }

    setStatus('analyzing');
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({ image: uploadedImage }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || '解析に失敗しました');

      const d = result.data;
      const aiMonth = Number(d.month) || new Date().getMonth() + 1;
      const aiDay = Number(d.day) || new Date().getDate();
      setFormData({
        title: d.title || '',
        originalText: (d.originalText || '').replace(/\\n/g, '\n'),
        modernTranslation: (d.modernTranslation || '').replace(/\\n/g, '\n'),
        glossary: (d.glossary || '').replace(/\\n/g, '\n'),
        background: (d.background || '').replace(/\\n/g, '\n'),
        implication: (d.implication || '').replace(/\\n/g, '\n'),
      });
      setCalMonth(aiMonth);
      setCalYear(new Date().getFullYear());
      setSelectedDay(aiDay);
      setStatus('idle');
      setSuccessMessage('AI解析が完了しました。内容を確認・編集して登録してください。');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '解析に失敗しました');
    }
  };

  // 保存（GitHub API経由）
  const handleSave = async () => {
    if (!formData.title) { setErrorMessage('タイトルは必須です'); return; }
    if (!githubToken) { setErrorMessage('GitHubトークンを入力してください'); return; }

    setStatus('saving');
    setErrorMessage('');

    try {
      const payload = { ...formData, month: calMonth, day: selectedDay, imageData: uploadedImage };
      const res = await fetch('/api/save-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GitHub-Token': githubToken },
        body: JSON.stringify(payload),
      });

      // レスポンスがJSONでない場合のハンドリング（Vercelのエラーページ等）
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(
          res.status === 413
            ? '画像サイズが大きすぎます。小さい画像を使用してください。'
            : `サーバーエラー (${res.status}): ${text.substring(0, 100)}`
        );
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.error || '保存に失敗しました');

      setStatus('saved');
      setSuccessMessage(`${calMonth}月${selectedDay}日「${formData.title}」をGitHubに保存しました。Vercelが自動デプロイします。`);
      // 今日の日付にリセット
      const now = new Date();
      setFormData(INITIAL_FORM);
      setCalMonth(now.getMonth() + 1);
      setCalYear(now.getFullYear());
      setSelectedDay(now.getDate());
      setUploadedImage(null);
      setTimeout(() => { setStatus('idle'); setSuccessMessage(''); }, 6000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  const isAnalyzing = status === 'analyzing';
  const isSaving = status === 'saving';
  const canAnalyze = !!apiKey && !!uploadedImage && !isAnalyzing && !isSaving;
  const canSave = !!formData.title && !!githubToken && !isAnalyzing && !isSaving;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    backgroundColor: '#f5f1ec', border: '1px solid rgba(107,83,68,0.15)',
    fontSize: '14px', color: '#3d3428', outline: 'none',
    fontFamily: "'Noto Serif JP', serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', color: '#8a7d6b',
    marginBottom: '6px', fontWeight: 500,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff', borderRadius: '14px',
    border: '1px solid rgba(107,83,68,0.15)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px',
  };

  // カレンダー生成（動的年対応）
  const daysCount = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  // mounted後のみ「今日」をハイライト（SSR時はハイライトなし）
  const [todayInfo, setTodayInfo] = useState({ year: 0, month: 0, day: 0 });
  useEffect(() => {
    const now = new Date();
    setTodayInfo({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
  }, []);
  const isToday = (d: number) => calYear === todayInfo.year && calMonth === todayInfo.month && d === todayInfo.day;
  const isSelected = (d: number) => d === selectedDay;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ===== API設定 ===== */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <svg style={{ width: '18px', height: '18px', color: '#8a7d6b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#3d3428' }}>API設定</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Gemini APIキー（AI解析用）</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Google Gemini APIキーを入力" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>GitHub Personal Access Token（データ保存用）</label>
            <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_xxxx... (repoスコープが必要)" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={handleSaveTokens} style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#6b5344', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>保存</button>
            {(apiKey || githubToken) && (
              <button type="button" onClick={handleClearTokens} style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#f5f1ec', color: '#6b5344', border: '1px solid rgba(107,83,68,0.15)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>すべてクリア</button>
            )}
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#8a7d6b', marginTop: '8px' }}>キーはブラウザのlocalStorageに保存されます（サーバーには保存されません）</p>
      </div>

      {/* ===== メインフォーム ===== */}
      <div style={{ ...cardStyle, padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3d3428', marginBottom: '20px' }}>新規登録</h3>

        {errorMessage && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{errorMessage}</div>
        )}
        {successMessage && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '13px', marginBottom: '16px' }}>{successMessage}</div>
        )}

        {/* Step 1: 画像 + カレンダー（左右2列） */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Step 1: 書籍スクリーンショット ＆ 日付選択</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 左: 画像アップロード */}
            <div style={{ flex: 1 }}>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById('image-input')?.click()}
                style={{
                  border: '2px dashed rgba(107,83,68,0.2)', borderRadius: '14px',
                  padding: uploadedImage ? '12px' : '30px 16px',
                  textAlign: 'center', cursor: 'pointer',
                  backgroundColor: uploadedImage ? '#fff' : '#faf8f5',
                  minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {uploadedImage ? (
                  <div>
                    <img src={uploadedImage} alt="Uploaded" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '10px', display: 'block' }} />
                    <p style={{ fontSize: '11px', color: '#8a7d6b', marginTop: '6px' }}>クリックで変更</p>
                  </div>
                ) : (
                  <div>
                    <svg style={{ width: '28px', height: '28px', margin: '0 auto 6px', color: '#8a7d6b', display: 'block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p style={{ fontWeight: 500, color: '#3d3428', fontSize: '13px' }}>ドラッグ＆ドロップ</p>
                    <p style={{ fontSize: '11px', color: '#8a7d6b', marginTop: '2px' }}>またはクリック</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageSelect} id="image-input" style={{ display: 'none' }} />
              </div>
            </div>

            {/* 右: Googleカレンダー風ミニカレンダー */}
            <div style={{
              width: '280px', flexShrink: 0,
              border: '1px solid rgba(107,83,68,0.15)', borderRadius: '14px',
              padding: '14px', backgroundColor: '#fff',
            }}>
              {/* ヘッダー: 年月 + 矢印 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#3d3428' }}>{calYear}年{calMonth}月</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" onClick={handleCalPrev} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#6b5344', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                  <button type="button" onClick={handleCalNext} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#6b5344', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                </div>
              </div>

              {/* 曜日ヘッダー */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '4px' }}>
                {DAY_LABELS.map((label) => (
                  <div key={label} style={{ fontSize: '11px', color: '#8a7d6b', fontWeight: 500, padding: '2px 0' }}>{label}</div>
                ))}
              </div>

              {/* 日付グリッド */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                {/* 空白セル */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* 日 */}
                {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => {
                  const sel = isSelected(d);
                  const td = isToday(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleCalDaySelect(d)}
                      style={{
                        width: '32px', height: '32px', margin: '1px auto',
                        borderRadius: '50%',
                        border: td && !sel ? '1px solid #4285f4' : 'none',
                        backgroundColor: sel ? '#6b5344' : 'transparent',
                        color: sel ? '#fff' : td ? '#4285f4' : '#3d3428',
                        fontWeight: sel || td ? 600 : 400,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* 選択表示 */}
              <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '13px', color: '#6b5344', fontWeight: 600 }}>
                {calMonth}月{selectedDay}日
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: AI解析 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Step 2: AI自動解析</label>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              fontWeight: 600, fontSize: '14px',
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              background: canAnalyze ? 'linear-gradient(135deg, #7f22fe, #4f39f6)' : 'rgba(107,83,68,0.15)',
              color: canAnalyze ? '#fff' : '#8a7d6b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {isAnalyzing ? (
              <>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
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
          {!apiKey && <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>Gemini APIキーを設定してください</p>}
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(107,83,68,0.15)', margin: '0 0 20px' }} />

        {/* Step 3: フォーム */}
        <div>
          <label style={labelStyle}>Step 3: 内容確認・編集</label>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>タイトル</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="例: 至誠神の如し" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>原文</label>
            <textarea name="originalText" value={formData.originalText} onChange={handleInputChange} rows={4} placeholder="書籍から抽出された原文" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>現代語訳</label>
            <textarea name="modernTranslation" value={formData.modernTranslation} onChange={handleInputChange} rows={4} placeholder="AIが生成した現代語訳" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>語句解説</label>
            <textarea name="glossary" value={formData.glossary} onChange={handleInputChange} rows={3} placeholder="AIが生成した語句解説" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>補足・背景</label>
            <textarea name="background" value={formData.background} onChange={handleInputChange} rows={3} placeholder="AIが生成した補足・背景情報" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>仕事／暮らしへの示唆</label>
            <textarea name="implication" value={formData.implication} onChange={handleInputChange} rows={3} placeholder="AIが生成した示唆" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* 登録ボタン */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            backgroundColor: canSave ? '#6b5344' : 'rgba(107,83,68,0.15)',
            color: canSave ? '#fff' : '#8a7d6b',
            fontWeight: 600, fontSize: '15px',
            cursor: canSave ? 'pointer' : 'not-allowed',
          }}
        >
          {isSaving ? '保存中...' : `${calMonth}月${selectedDay}日「${formData.title || '---'}」を登録`}
        </button>
        {!githubToken && (
          <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px', textAlign: 'center' }}>GitHubトークンを設定すると登録が有効になります</p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </div>
  );
}
