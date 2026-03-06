import { List, Datagrid, TextField } from "react-admin";

export const WorkOrderList = () => (
  <List>
    <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="status" />
        <TextField source="createdAt" />
        <TextField source="equipmentId" />
        <TextField source="equipment" />
    </Datagrid>
  </List>
);
