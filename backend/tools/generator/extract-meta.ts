import { ModelMeta } from './model-meta';

type DmmfField = {
  name: string;
  type: unknown;
  isRequired: boolean;
  isList: boolean;
  kind: string;
};

type DmmfModel = {
  name: string;
  fields: DmmfField[];
};

type DmmfDocument = {
  datamodel: {
    models: DmmfModel[];
  };
};

export function extractModels(dmmf: DmmfDocument): ModelMeta[] {
  return dmmf.datamodel.models.map(
    (model): ModelMeta => ({
      name: model.name,
      fields: model.fields.map((field) => ({
        name: field.name,
        type: String(field.type),
        isRequired: field.isRequired,
        isList: field.isList,
        isRelation: field.kind === 'object',
      })),
    }),
  );
}
