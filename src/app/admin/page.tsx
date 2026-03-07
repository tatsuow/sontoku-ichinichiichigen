import { getAllQuotes } from '@/lib/quotes';
import { AISpecification } from '@/components/AISpecification';
import { RegistrationForm } from '@/components/RegistrationForm';
import { QuotesTable } from '@/components/QuotesTable';

export const revalidate = 3600; // Revalidate once per hour

export default async function AdminPage() {
  const quotes = await getAllQuotes();

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3d3428] mb-2">
          データ管理
        </h1>
        <p className="text-[#8a7d6b]">
          書籍スクリーンショットのアップロードとAI解析による解説データの登録
        </p>
      </div>

      {/* AI Specification */}
      <AISpecification />

      {/* Registration Form */}
      <div className="mb-8">
        <RegistrationForm />
      </div>

      {/* Quotes Table */}
      <QuotesTable quotes={quotes} />
    </div>
  );
}
