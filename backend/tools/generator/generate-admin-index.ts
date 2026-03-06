import fs from 'fs';
import path from 'path';

type ModelMeta = {
  name: string;
};

const META_PATH = path.resolve('generated/meta.json');
const OUTPUT_DIR = path.resolve('../frontend/src/admin/generated');

function lower(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateIndex(models: ModelMeta[]): void {
  const imports = models
    .map((m) => {
      const name = m.name;
      const lowerName = lower(name);

      return `import { ${name}List } from "./${lowerName}.list"`;
    })
    .join('\n');

  const resources = models
    .map((m) => {
      const name = m.name;
      const lowerName = lower(name);

      return `  {
    name: "${lowerName}",
    list: ${name}List
  }`;
    })
    .join(',\n');

  const content = `${imports}

export const adminResources = [
${resources}
]
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), content);
}

function main(): void {
  const raw = fs.readFileSync(META_PATH, 'utf8');

  const meta = JSON.parse(raw) as { models: ModelMeta[] };

  generateIndex(meta.models);
}

main();
