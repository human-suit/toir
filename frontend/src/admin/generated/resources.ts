

import { UserList } from "./user.list";
import { UserCreate, UserEdit, UserShow } from "./crud/UserCrud";

import { EquipmentList } from "./equipment.list";
import { EquipmentCreate, EquipmentEdit, EquipmentShow } from "./crud/EquipmentCrud";

import { WorkOrderList } from "./workOrder.list";
import { WorkOrderCreate, WorkOrderEdit, WorkOrderShow } from "./crud/WorkOrderCrud";


export const adminResources = [
{
  name: "user",
  list: UserList,
  create: UserCreate,
  edit: UserEdit,
  show: UserShow
},
{
  name: "equipment",
  list: EquipmentList,
  create: EquipmentCreate,
  edit: EquipmentEdit,
  show: EquipmentShow
},
{
  name: "workOrder",
  list: WorkOrderList,
  create: WorkOrderCreate,
  edit: WorkOrderEdit,
  show: WorkOrderShow
}
];
