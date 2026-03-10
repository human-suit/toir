import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

function lower(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function generateResources(): void {
  const metaPath = path.resolve('generated/meta.json');

  const raw = fs.readFileSync(metaPath, 'utf8');

  const meta = JSON.parse(raw) as { models: ModelMeta[] };

  const models: ModelMeta[] = meta.models;

  const imports = models
    .map(
      (m) =>
        `import { ${m.name}List } from "./generated/${lower(m.name)}.list";
import { ${m.name}Create, ${m.name}Edit, ${m.name}Show } from "./generated/crud/${m.name}Crud";`,
    )
    .join('\n');

  const resources = models
    .map(
      (m) => `{
  name: "${lower(m.name)}",
  list: ${m.name}List,
  create: ${m.name}Create,
  edit: ${m.name}Edit,
  show: ${m.name}Show
}`,
    )
    .join(',\n');

  const content = `
${imports}

export const adminResources = [
${resources}
];
`;

  const outputDir = path.resolve('../frontend/src/admin/generated');

  fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, 'resources.ts');

  fs.writeFileSync(outputFile, content);
}

generateResources();
