import { remark } from 'remark';
import remarkHtml from 'remark-html';

export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}
