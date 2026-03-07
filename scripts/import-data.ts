import fs from 'fs';
import path from 'path';

const sourceDir = process.argv[2];
const destDir = path.join(process.cwd(), 'data');

if (!sourceDir) {
  console.error('Usage: npx ts-node scripts/import-data.ts <source-directory>');
  process.exit(1);
}

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.md'));

let copiedCount = 0;

for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);

  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${file}`);
    copiedCount++;
  } catch (err) {
    console.error(`Failed to copy ${file}:`, err);
  }
}

console.log(`\nImport completed: ${copiedCount} files copied to ${destDir}`);
