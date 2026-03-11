import {
List,
Datagrid,
TextField,
NumberField,
DateField,
EditButton,
ShowButton,
DeleteButton
} from "react-admin";

export const TestAuto4List = () => (
  <List>
    <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="name" />

        <EditButton />
        <ShowButton />
        <DeleteButton />
    </Datagrid>
  </List>
);
