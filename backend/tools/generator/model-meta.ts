export interface ModelMeta {
  name: string;
  fields: FieldMeta[];
}

export interface FieldMeta {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
}
