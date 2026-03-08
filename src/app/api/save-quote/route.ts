import { NextRequest, NextResponse } from 'next/server';

const REPO_OWNER = 'tatsuow';
const REPO_NAME = 'sontoku-ichinichiichigen';
const BRANCH = 'main';

async function createOrUpdateFile(
  token: string,
  filePath: string,
  content: string,
  message: string
) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  // 既存ファイルがあるかチェック（SHA取得のため）
  let sha: string | undefined;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) {
    body.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message || `GitHub API error: ${putRes.status}`);
  }

  return putRes.json();
}

async function uploadBinaryFile(
  token: string,
  filePath: string,
  base64Data: string,
  message: string
) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  let sha: string | undefined;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const body: Record<string, string> = {
    message,
    content: base64Data,
    branch: BRANCH,
  };
  if (sha) {
    body.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message || `GitHub API error: ${putRes.status}`);
  }

  return putRes.json();
}

export async function POST(request: NextRequest) {
  try {
    const githubToken = request.headers.get('X-GitHub-Token');
    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: 'GitHubトークンが設定されていません' },
        { status: 401 }
      );
    }

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

    const mdFilename = `${datePrefix}_${title}.md`;

    // MDファイルをGitHubにコミット
    await createOrUpdateFile(
      githubToken,
      `data/${mdFilename}`,
      mdContent,
      `${mm}月${dd}日「${title}」を追加`
    );

    // 画像の保存
    let savedImageFilename: string | null = null;
    if (imageData) {
      const imgMatch = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
      if (imgMatch) {
        const ext = imgMatch[1] === 'jpeg' ? 'jpg' : imgMatch[1];
        const imgBase64 = imgMatch[2];

        savedImageFilename = `${datePrefix}.${ext}`;
        await uploadBinaryFile(
          githubToken,
          `public/images/${savedImageFilename}`,
          imgBase64,
          `${mm}月${dd}日の書影画像を追加`
        );
      }
    }

    return NextResponse.json({
      success: true,
      filename: mdFilename,
      imageFilename: savedImageFilename,
    });
  } catch (error) {
    console.error('Save quote error:', error);
    let message = '保存に失敗しました';
    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes('Bad credentials') || msg.includes('401')) {
        message = 'GitHubトークンが無効です。正しいPersonal Access Tokenを入力してください。';
      } else if (msg.includes('Not Found') || msg.includes('404')) {
        message = 'リポジトリが見つかりません。トークンの権限を確認してください。';
      } else {
        message = `保存エラー: ${msg.substring(0, 150)}`;
      }
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
