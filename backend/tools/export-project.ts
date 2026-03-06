import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'project-context.txt');

const IGNORE = [
  'node_modules',
  'dist',
  '.git',
  '.next',
  'coverage',
  'project-context.txt',
];

const ALLOWED = ['.ts', '.js', '.json', '.prisma', '.md', '.yml', '.yaml'];

function walk(dir: string, files: string[] = []) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (IGNORE.some((i) => full.includes(i))) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, files);
    } else {
      if (ALLOWED.includes(path.extname(full))) {
        files.push(full);
      }
    }
  }

  return files;
}

function exportProject() {
  const files = walk(ROOT);

  const out: string[] = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);

    const content = fs.readFileSync(file, 'utf8');

    out.push(`\n===== FILE: ${rel} =====\n`);
    out.push(content);
  }

  fs.writeFileSync(OUTPUT, out.join('\n'));

  console.log(`Exported ${files.length} files to project-context.txt`);
}

exportProject();
