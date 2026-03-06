import fs from 'fs';
import path from 'path';
import { ModelMeta } from './model-meta';

type MetaFile = {
  models: ModelMeta[];
};

export function readMeta(): ModelMeta[] {
  const file = path.resolve('generated/meta.json');

  const raw = fs.readFileSync(file, 'utf8');

  const parsed = JSON.parse(raw) as MetaFile;

  return parsed.models;
}
