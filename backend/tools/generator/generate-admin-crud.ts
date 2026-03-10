import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

const ROOT = process.cwd();

export function generateAdminCrud(models: ModelMeta[]): void {
  const outDir = path.join(
    ROOT,
    '..',
    'frontend',
    'src',
    'admin',
    'generated',
    'crud',
  );

  fs.mkdirSync(outDir, { recursive: true });

  for (const model of models) {
    const name: string = model.name;

    const inputs: string = model.fields
      .filter((f) => !f.isRelation && f.name !== 'id')
      .map((f) => {
        if (f.type === 'Int') {
          return `<NumberInput source="${f.name}" />`;
        }

        if (f.type === 'DateTime') {
          return `<DateInput source="${f.name}" />`;
        }

        return `<TextInput source="${f.name}" />`;
      })
      .join('\n        ');

    const fields: string = model.fields
      .filter((f) => !f.isRelation)
      .map((f) => {
        if (f.type === 'Int') {
          return `<NumberField source="${f.name}" />`;
        }

        if (f.type === 'DateTime') {
          return `<DateField source="${f.name}" />`;
        }

        return `<TextField source="${f.name}" />`;
      })
      .join('\n        ');

    const fileContent: string = `
import {
Create,
Edit,
Show,
SimpleForm,
SimpleShowLayout,
TextInput,
NumberInput,
DateInput,
TextField,
NumberField,
DateField
} from "react-admin";

export const ${name}Create = () => (
  <Create>
    <SimpleForm>
        ${inputs}
    </SimpleForm>
  </Create>
);

export const ${name}Edit = () => (
  <Edit>
    <SimpleForm>
        ${inputs}
    </SimpleForm>
  </Edit>
);

export const ${name}Show = () => (
  <Show>
    <SimpleShowLayout>
        ${fields}
    </SimpleShowLayout>
  </Show>
);
`;

    const filePath: string = path.join(outDir, `${name}Crud.tsx`);

    fs.writeFileSync(filePath, fileContent);
  }

  console.log('Admin CRUD generated');
}

function main(): void {
  const metaPath = path.join(process.cwd(), 'generated', 'meta.json');

  if (!fs.existsSync(metaPath)) {
    throw new Error('meta.json not found: ' + metaPath);
  }

  const raw = fs.readFileSync(metaPath, 'utf8');

  const meta = JSON.parse(raw) as {
    models: ModelMeta[];
  };

  generateAdminCrud(meta.models);
}

main();
