import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

const ROOT = process.cwd();

function inputForField(f: any): string {
  if (f.type === 'Int') {
    return `<NumberInput source="${f.name}" />`;
  }

  if (f.type === 'Float') {
    return `<NumberInput source="${f.name}" />`;
  }

  if (f.type === 'Boolean') {
    return `<BooleanInput source="${f.name}" />`;
  }

  if (f.type === 'DateTime') {
    return `<DateInput source="${f.name}" />`;
  }

  return `<TextInput source="${f.name}" />`;
}

function fieldForType(f: any): string {
  if (f.type === 'Int') {
    return `<NumberField source="${f.name}" />`;
  }

  if (f.type === 'Float') {
    return `<NumberField source="${f.name}" />`;
  }

  if (f.type === 'Boolean') {
    return `<BooleanField source="${f.name}" />`;
  }

  if (f.type === 'DateTime') {
    return `<DateField source="${f.name}" />`;
  }

  return `<TextField source="${f.name}" />`;
}

export function generateAdminCrud(models: ModelMeta[]): void {
  const outDir = path.join(
    process.cwd(),
    '..',
    'frontend',
    'src',
    'admin',
    'generated'
  );

  fs.mkdirSync(outDir, { recursive: true });

  for (const model of models) {
    const name: string = model.name;

    const inputFields = model.fields
      .filter(
        (f) =>
          !f.isRelation &&
          f.name !== 'id' &&
          f.name !== 'createdAt' &&
          f.name !== 'updatedAt',
      )
      .map((f) => inputForField(f))
      .join('\n        ');

    const showFields = model.fields
      .filter((f) => !f.isRelation)
      .map((f) => fieldForType(f))
      .join('\n        ');

    const fileContent = `
import {
Create,
Edit,
Show,
SimpleForm,
SimpleShowLayout,
TextInput,
NumberInput,
DateInput,
BooleanInput,
TextField,
NumberField,
DateField,
BooleanField
} from "react-admin";

export const ${name}Create = () => (
  <Create>
    <SimpleForm>
        ${inputFields}
    </SimpleForm>
  </Create>
);

export const ${name}Edit = () => (
  <Edit>
    <SimpleForm>
        ${inputFields}
    </SimpleForm>
  </Edit>
);

export const ${name}Show = () => (
  <Show>
    <SimpleShowLayout>
        ${showFields}
    </SimpleShowLayout>
  </Show>
);
`;

    const filePath = path.join(outDir, 'crud', `${name}Crud.tsx`);

    fs.writeFileSync(filePath, fileContent.trim());
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