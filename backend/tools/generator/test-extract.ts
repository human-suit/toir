import { getDMMF } from '@prisma/internals';
import { readFile } from 'fs/promises';
import { extractModels } from './extract-meta';

async function main() {
  const schema = await readFile('./prisma/schema.prisma', 'utf8');

  const dmmf = await getDMMF({
    datamodel: schema,
  });

  const models = extractModels(dmmf as any);

  console.log(JSON.stringify(models, null, 2));
}

main();
