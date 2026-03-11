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

export const TestAutoCreate = () => (
  <Create>
    <SimpleForm>
        <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export const TestAutoEdit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const TestAutoShow = () => (
  <Show>
    <SimpleShowLayout>
        <NumberField source="id" />
        <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);