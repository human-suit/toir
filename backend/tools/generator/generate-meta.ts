import { getDMMF } from '@prisma/internals';
import fs from 'fs';
import path from 'path';
import { writeMeta } from './write-meta';
import { ModelMeta } from './model-meta';

async function main(): Promise<void> {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

    if (!fs.existsSync(schemaPath)) {
      throw new Error('Prisma schema not found: ' + schemaPath);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

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

    console.log('meta.json generated successfully');
  } catch (err) {
    console.error('Meta generation failed');
    console.error(err);
    process.exit(1);
  }
}

main();
