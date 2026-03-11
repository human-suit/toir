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

export const UserCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="role" />
    </SimpleForm>
  </Create>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="role" />
    </SimpleForm>
  </Edit>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
        <NumberField source="id" />
        <TextField source="email" />
        <TextField source="name" />
        <TextField source="role" />
        <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);