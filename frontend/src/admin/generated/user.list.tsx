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

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="email" />
        <TextField source="name" />
        <TextField source="role" />
        <DateField source="createdAt" />

        <EditButton />
        <ShowButton />
        <DeleteButton />
    </Datagrid>
  </List>
);
