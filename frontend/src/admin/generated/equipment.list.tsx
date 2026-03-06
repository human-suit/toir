import { List, Datagrid, TextField } from "react-admin";

export const EquipmentList = () => (
  <List>
    <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="serial" />
        <TextField source="createdAt" />
    </Datagrid>
  </List>
);
