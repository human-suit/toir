import fs from 'fs';
import path from 'path';

type FieldMeta = {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
  relationTarget: string | null;
};

type ModelMeta = {
  name: string;
  fields: FieldMeta[];
};

const META_PATH = path.join(process.cwd(), 'generated', 'meta.json');


const OUTPUT_DIR = path.join(
      process.cwd(),
      '..',
      'frontend',
      'src',
      'admin',
      'generated'
    );

function lower(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function ensureDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function mapField(field: FieldMeta): string {
  if (field.type === 'Int') {
    return `<NumberField source="${field.name}" />`;
  }

  if (field.type === 'DateTime') {
    return `<DateField source="${field.name}" />`;
  }

  return `<TextField source="${field.name}" />`;
}

function generateList(model: ModelMeta): void {
  const modelName = model.name;

  const fileName = `${lower(modelName)}.list.tsx`;

  const fields = model.fields
    .filter((f) => !f.isList)
    .map((f) => `        ${mapField(f)}`)
    .join('\n');

  const content = `import {
List,
Datagrid,
TextField,
NumberField,
DateField,
EditButton,
ShowButton,
DeleteButton
} from "react-admin";

export const ${modelName}List = () => (
  <List>
    <Datagrid rowClick="edit">
${fields}

        <EditButton />
        <ShowButton />
        <DeleteButton />
    </Datagrid>
  </List>
);
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), content);
}

function main(): void {
  ensureDir();

  if (!fs.existsSync(META_PATH)) {
    throw new Error('meta.json not found: ' + META_PATH);
  }

  const raw = fs.readFileSync(META_PATH, 'utf8');

  const meta = JSON.parse(raw) as { models: ModelMeta[] };

  for (const model of meta.models) {
    generateList(model);
  }

  console.log('Admin lists generated');
}

main();