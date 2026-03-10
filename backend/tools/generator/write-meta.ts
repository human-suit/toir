import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

export function writeMeta(models: ModelMeta[]) {
  const outDir = path.join(process.cwd(), 'generated');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filePath = path.join(outDir, 'meta.json');

  const meta = {
    models,
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(meta, null, 2), 'utf8');
    console.log('meta.json generated at:', filePath);
  } catch (err) {
    console.error('Failed to write meta.json');
    console.error(err);
    process.exit(1);
  }
}
