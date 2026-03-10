
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

export const UserCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="role" />
        <DateInput source="createdAt" />
    </SimpleForm>
  </Create>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="role" />
        <DateInput source="createdAt" />
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
