import { List, Datagrid, TextField } from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid>
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="name" />
        <TextField source="role" />
        <TextField source="createdAt" />
    </Datagrid>
  </List>
);
