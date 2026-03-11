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

export const EquipmentCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="name" />
        <TextInput source="serial" />
    </SimpleForm>
  </Create>
);

export const EquipmentEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="name" />
        <TextInput source="serial" />
    </SimpleForm>
  </Edit>
);

export const EquipmentShow = () => (
  <Show>
    <SimpleShowLayout>
        <NumberField source="id" />
        <TextField source="name" />
        <TextField source="serial" />
        <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);