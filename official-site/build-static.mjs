import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const out = join(root, 'dist');

const skipRoot = new Set([
  '.vercelignore',
  'build-static.mjs',
  'dist',
  'fruit-image-inventory.json',
  'KFA_MEMBER_APPS_SCRIPT.gs',
  'KFA_MEMBER_SYSTEM_SETUP.md',
  'package.json',
  'vercel.json',
]);

const allowedFilesDir = new Set([
  'tstc진단프로그램.html',
  'tstc결과확인.html',
]);

function copyEntry(src, dest) {
  const name = basename(src);
  if (skipRoot.has(name)) return;

  if (statSync(src).isDirectory()) {
    if (name === 'files') {
      mkdirSync(dest, { recursive: true });
      for (const file of readdirSync(src)) {
        if (!allowedFilesDir.has(file)) continue;
        cpSync(join(src, file), join(dest, file));
      }
      return;
    }

    cpSync(src, dest, { recursive: true });
    return;
  }

  cpSync(src, dest);
}

if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const entry of readdirSync(root)) {
  copyEntry(join(root, entry), join(out, entry));
}

console.log('KFA static site built to dist/');
