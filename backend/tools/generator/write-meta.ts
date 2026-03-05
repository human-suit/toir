import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

export function writeMeta(models: ModelMeta[]) {
  const outDir = path.resolve(process.cwd(), 'generated');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const file = path.join(outDir, 'meta.json');

  fs.writeFileSync(file, JSON.stringify(models, null, 2));
}
