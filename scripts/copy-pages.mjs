import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const source = path.join(root, 'dist', 'client');
const target = path.join(root, 'docs');
if (!existsSync(path.join(source, 'index.html'))) throw new Error('먼저 npm run build를 실행해 주세요.');
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log('GitHub Pages 파일을 docs/에 복사했습니다.');

