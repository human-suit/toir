import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

function lower(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function generateResources() {
  const metaPath = path.resolve('generated/meta.json');

  const raw = fs.readFileSync(metaPath, 'utf8');

  const meta = JSON.parse(raw) as { models: ModelMeta[] };

  const models: ModelMeta[] = meta.models;

  const resources = models
    .map((m: ModelMeta) => `{ name: '${lower(m.name)}' }`)
    .join(',\n');

  const content = `export const resources = [
${resources}
]
`;

  const outputDir = path.resolve('../frontend/src/admin');

  fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, 'resources.ts');

  fs.writeFileSync(outputFile, content);
}

generateResources();
