import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'APIキーが設定されていません' },
        { status: 401 }
      );
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { success: false, error: '画像データがありません' },
        { status: 400 }
      );
    }

    // Base64データからMIMEタイプとデータ部分を抽出
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { success: false, error: '無効な画像フォーマットです' },
        { status: 400 }
      );
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `あなたは二宮尊徳（二宮金次郎）の専門家です。
この画像は書籍「二宮尊徳一日一言」（致知出版社）のページのスクリーンショットです。

以下の情報を正確に抽出・生成してください：

1. **月** (month): ページに記載されている月の数字（1〜12）
2. **日** (day): ページに記載されている日の数字（1〜31）
3. **タイトル** (title): ページの見出し・タイトル
4. **原文** (originalText): ページに記載されている原文（古典日本語のテキスト）をそのまま正確に書き起こしてください。略解がある場合はそれも含めてください。

さらに、原文の内容を深く理解した上で、以下のセクションを**生成**してください：

5. **現代語訳** (modernTranslation): 原文を現代の日本語でわかりやすく翻訳してください。格調高い文体を保ちつつ、現代人にもわかる言葉で。
6. **語句解説** (glossary): 原文中の難解な語句や概念について解説してください。Markdown箇条書きで。
7. **補足・背景** (background): 尊徳の思想的背景や、この言葉が生まれた歴史的文脈を説明してください。
8. **仕事／暮らしへの示唆** (implication): この言葉から現代のビジネスや日常生活に活かせる教訓を導き出してください。

必ず以下のJSON形式で回答してください。他のテキストは一切含めないでください：
{
  "month": 数字,
  "day": 数字,
  "title": "文字列",
  "originalText": "文字列（改行は\\nで表現）",
  "modernTranslation": "文字列（改行は\\nで表現）",
  "glossary": "文字列（Markdown形式、改行は\\nで表現）",
  "background": "文字列（改行は\\nで表現）",
  "implication": "文字列（改行は\\nで表現）"
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const responseText = result.response.text();

    // JSONを抽出（コードブロックで囲まれている場合も対応）
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // JSON部分だけ抽出
      const braceMatch = responseText.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonStr = braceMatch[0];
      }
    }

    const data = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Analyze API error:', error);
    const message = error instanceof Error ? error.message : '解析に失敗しました';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
