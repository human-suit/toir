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

export const EquipmentList = () => (
  <List>
    <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="name" />
        <TextField source="serial" />
        <DateField source="createdAt" />

        <EditButton />
        <ShowButton />
        <DeleteButton />
    </Datagrid>
  </List>
);
