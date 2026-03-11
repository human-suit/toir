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

export const WorkOrderList = () => (
  <List>
    <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="status" />
        <DateField source="createdAt" />
        <NumberField source="equipmentId" />
        <TextField source="equipment" />

        <EditButton />
        <ShowButton />
        <DeleteButton />
    </Datagrid>
  </List>
);
