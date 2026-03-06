import { UserList } from "./user.list"
import { EquipmentList } from "./equipment.list"
import { WorkOrderList } from "./workOrder.list"

export const adminResources = [
  {
    name: "user",
    list: UserList
  },
  {
    name: "equipment",
    list: EquipmentList
  },
  {
    name: "workOrder",
    list: WorkOrderList
  }
]
