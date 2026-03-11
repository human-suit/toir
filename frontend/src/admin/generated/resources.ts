import { UserList } from "./user.list";
import { UserCreate, UserEdit, UserShow } from "./crud/UserCrud";


import { EquipmentList } from "./equipment.list";
import { EquipmentCreate, EquipmentEdit, EquipmentShow } from "./crud/EquipmentCrud";


import { WorkOrderList } from "./workOrder.list";
import { WorkOrderCreate, WorkOrderEdit, WorkOrderShow } from "./crud/WorkOrderCrud";


import { TestAutoList } from "./testAuto.list";
import { TestAutoCreate, TestAutoEdit, TestAutoShow } from "./crud/TestAutoCrud";


import { TestAuto2List } from "./testAuto2.list";
import { TestAuto2Create, TestAuto2Edit, TestAuto2Show } from "./crud/TestAuto2Crud";


import { TestAuto3List } from "./testAuto3.list";
import { TestAuto3Create, TestAuto3Edit, TestAuto3Show } from "./crud/TestAuto3Crud";


import { TestAuto4List } from "./testAuto4.list";
import { TestAuto4Create, TestAuto4Edit, TestAuto4Show } from "./crud/TestAuto4Crud";


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
  },
  {
    name: "testAuto",
    list: TestAutoList,
    create: TestAutoCreate,
    edit: TestAutoEdit,
    show: TestAutoShow
  },
  {
    name: "testAuto2",
    list: TestAuto2List,
    create: TestAuto2Create,
    edit: TestAuto2Edit,
    show: TestAuto2Show
  },
  {
    name: "testAuto3",
    list: TestAuto3List,
    create: TestAuto3Create,
    edit: TestAuto3Edit,
    show: TestAuto3Show
  },
  {
    name: "testAuto4",
    list: TestAuto4List,
    create: TestAuto4Create,
    edit: TestAuto4Edit,
    show: TestAuto4Show
  }
];