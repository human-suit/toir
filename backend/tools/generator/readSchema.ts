import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve('prisma/schema.prisma');

type Field = {
  name: string;
  type: string;
};

type Model = {
  name: string;
  fields: Field[];
};

function parseModels(schema: string): Model[] {
  const modelBlocks = schema.match(/model\s+\w+\s+\{[\s\S]*?\}/g) || [];

  const models: Model[] = [];

  for (const block of modelBlocks) {
    const nameMatch = block.match(/model\s+(\w+)/);
    if (!nameMatch) continue;

    const name = nameMatch[1];

    const lines = block.split('\n').slice(1, -1);

    const fields: Field[] = [];

    for (const line of lines) {
      const clean = line.trim();

      if (!clean || clean.startsWith('//')) continue;

      const parts = clean.split(/\s+/);

      const fieldName = parts[0];
      const fieldType = parts[1];

      fields.push({
        name: fieldName,
        type: fieldType,
      });
    }

    models.push({
      name,
      fields,
    });
  }

  return models;
}

function main() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  const models = parseModels(schema);

  console.dir(models, { depth: null });
}

main();
