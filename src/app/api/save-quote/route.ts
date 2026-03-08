import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      month,
      day,
      title,
      originalText,
      modernTranslation,
      glossary,
      background,
      implication,
      imageData,
    } = body;

    if (!month || !day || !title) {
      return NextResponse.json(
        { success: false, error: '月、日、タイトルは必須です' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const datePrefix = `${currentYear}-${mm}-${dd}`;

    // MDファイルの生成
    const mdContent = `---
title: ${datePrefix}_${title}
source: 二宮尊徳一日一言　致知出版社
tags:
  - 二宮尊徳
---

## 原文
${originalText || ''}

## 現代語訳
${modernTranslation || ''}

## 語句解説
${glossary || ''}

## 補足・背景
${background || ''}

## 仕事／暮らしへの示唆
${implication || ''}
`;

    // data/ ディレクトリに保存
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const mdFilename = `${datePrefix}_${title}.md`;
    const mdPath = path.join(dataDir, mdFilename);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');

    // 画像の保存
    let savedImageFilename: string | null = null;
    if (imageData) {
      const imgMatch = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
      if (imgMatch) {
        const ext = imgMatch[1] === 'jpeg' ? 'jpg' : imgMatch[1];
        const imgBase64 = imgMatch[2];

        const imagesDir = path.join(process.cwd(), 'public', 'images');
        if (!fs.existsSync(imagesDir)) {
          fs.mkdirSync(imagesDir, { recursive: true });
        }

        savedImageFilename = `${datePrefix}.${ext}`;
        const imgPath = path.join(imagesDir, savedImageFilename);
        fs.writeFileSync(imgPath, Buffer.from(imgBase64, 'base64'));
      }
    }

    return NextResponse.json({
      success: true,
      filename: mdFilename,
      imageFilename: savedImageFilename,
    });
  } catch (error) {
    console.error('Save quote error:', error);
    const message = error instanceof Error ? error.message : '保存に失敗しました';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
