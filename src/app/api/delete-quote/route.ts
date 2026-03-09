import { NextRequest, NextResponse } from 'next/server';

const REPO_OWNER = 'tatsuow';
const REPO_NAME = 'sontoku-ichinichiichigen';
const BRANCH = 'main';

async function deleteFile(token: string, filePath: string, message: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  // SHA取得
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!getRes.ok) {
    if (getRes.status === 404) {
      return null; // ファイルが存在しない場合はスキップ
    }
    throw new Error(`ファイル情報の取得に失敗: ${getRes.status}`);
  }

  const existing = await getRes.json();
  const sha = existing.sha;

  const delRes = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });

  if (!delRes.ok) {
    const err = await delRes.json();
    throw new Error(err.message || `削除に失敗: ${delRes.status}`);
  }

  return delRes.json();
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

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: '削除対象のIDが指定されていません' },
        { status: 400 }
      );
    }

    // id は "2026-03-09_商法の掟" のような形式
    // MDファイル削除
    await deleteFile(
      githubToken,
      `data/${id}.md`,
      `${id} を削除`
    );

    // 画像ファイル削除（日付部分だけ抽出して探す）
    const dateMatch = id.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const datePrefix = dateMatch[1];
      // jpg, png, webp を試行
      for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
        const result = await deleteFile(
          githubToken,
          `public/images/${datePrefix}.${ext}`,
          `${datePrefix} の画像を削除`
        );
        if (result) break; // 見つかった拡張子で削除できたら終了
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quote error:', error);
    let message = '削除に失敗しました';
    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes('Bad credentials') || msg.includes('401')) {
        message = 'GitHubトークンが無効です。';
      } else if (msg.includes('Resource not accessible')) {
        message = 'トークンに書き込み権限がありません。';
      } else {
        message = `削除エラー: ${msg.substring(0, 200)}`;
      }
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
