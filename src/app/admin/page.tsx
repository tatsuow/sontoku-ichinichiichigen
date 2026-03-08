import { getAllQuotes } from '@/lib/quotes';
import { RegistrationForm } from '@/components/RegistrationForm';
import { QuotesTable } from '@/components/QuotesTable';

export const revalidate = 3600;

export default async function AdminPage() {
  const quotes = await getAllQuotes();

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#3d3428',
          marginBottom: '8px',
          fontFamily: "'Noto Serif JP', serif",
        }}>
          データ管理
        </h1>
        <p style={{ color: '#8a7d6b', fontSize: '14px' }}>
          書籍スクリーンショットをアップロードし、Google Gemini AIで自動解析して登録します
        </p>
      </div>

      {/* Registration Form */}
      <div style={{ marginBottom: '2rem' }}>
        <RegistrationForm />
      </div>

      {/* Quotes Table */}
      <QuotesTable quotes={quotes} />
    </div>
  );
}
