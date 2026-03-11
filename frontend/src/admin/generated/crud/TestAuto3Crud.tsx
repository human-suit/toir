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

export const TestAuto3Create = () => (
  <Create>
    <SimpleForm>
        <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export const TestAuto3Edit = () => (
  <Edit>
    <SimpleForm>
        <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const TestAuto3Show = () => (
  <Show>
    <SimpleShowLayout>
        <NumberField source="id" />
        <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);