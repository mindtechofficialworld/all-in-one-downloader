import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../dist');
const targetDir = path.resolve(__dirname, '../android/app/src/main/assets/public');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Syncing web assets to Android project...');
if (!fs.existsSync(sourceDir)) {
  console.error('Error: dist directory does not exist. Please run npm run build first.');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

copyRecursiveSync(sourceDir, targetDir);
console.log('✅ Web assets successfully copied to android/app/src/main/assets/public!');
