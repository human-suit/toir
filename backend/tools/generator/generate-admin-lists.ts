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

const META_PATH = path.resolve('../backend/generated/meta.json');
const OUTPUT_DIR = path.resolve('../frontend/src/admin/generated');

function lower(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function ensureDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function generateList(model: ModelMeta): void {
  const modelName = model.name;
  const fileName = `${lower(modelName)}.list.tsx`;

  const fields = model.fields
    .filter((f) => !f.isList)
    .map((f) => `        <TextField source="${f.name}" />`)
    .join('\n');

  const content = `import { List, Datagrid, TextField } from "react-admin";

export const ${modelName}List = () => (
  <List>
    <Datagrid>
${fields}
    </Datagrid>
  </List>
);
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), content);
}

function main(): void {
  ensureDir();

  const raw = fs.readFileSync(META_PATH, 'utf8');

  const meta = JSON.parse(raw) as { models: ModelMeta[] };

  for (const model of meta.models) {
    generateList(model);
  }
}

main();
