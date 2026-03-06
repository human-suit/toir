import { getDMMF } from '@prisma/internals';
import fs from 'fs';
import { writeMeta } from './write-meta';
import { ModelMeta } from './model-meta';

async function main(): Promise<void> {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

  const dmmf = await getDMMF({
    datamodel: schema,
  });

  const models: ModelMeta[] = dmmf.datamodel.models.map((model) => ({
    name: model.name,
    fields: model.fields.map((f) => {
      const isRelation = f.kind === 'object';

      return {
        name: f.name,
        type: String(f.type),
        isRequired: f.isRequired,
        isList: f.isList,
        isRelation,
        relationTarget: isRelation ? String(f.type) : null,
      };
    }),
  }));

  writeMeta(models);
}

main();
