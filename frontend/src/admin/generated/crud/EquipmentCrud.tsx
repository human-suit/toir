
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

export const EquipmentCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="name" />
        <TextInput source="serial" />
        <DateInput source="createdAt" />
    </SimpleForm>
  </Create>
);

export const EquipmentEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="name" />
        <TextInput source="serial" />
        <DateInput source="createdAt" />
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
