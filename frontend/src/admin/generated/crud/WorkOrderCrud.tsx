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

export const WorkOrderCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="title" />
        <TextInput source="description" />
        <TextInput source="status" />
        <NumberInput source="equipmentId" />
    </SimpleForm>
  </Create>
);

export const WorkOrderEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="title" />
        <TextInput source="description" />
        <TextInput source="status" />
        <NumberInput source="equipmentId" />
    </SimpleForm>
  </Edit>
);

export const WorkOrderShow = () => (
  <Show>
    <SimpleShowLayout>
        <NumberField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="status" />
        <DateField source="createdAt" />
        <NumberField source="equipmentId" />
    </SimpleShowLayout>
  </Show>
);