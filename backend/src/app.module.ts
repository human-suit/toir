import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { WorkOrderModule } from './modules/workorder/workorder.module';
import { TestAutoModule } from './modules/testauto/testauto.module';
import { TestAuto2Module } from './modules/testauto2/testauto2.module';
import { TestAuto3Module } from './modules/testauto3/testauto3.module';
import { TestAuto4Module } from './modules/testauto4/testauto4.module';

@Module({
  imports: [PrismaModule, UserModule, EquipmentModule, WorkOrderModule, TestAutoModule, TestAuto2Module, TestAuto3Module, TestAuto4Module],
})
export class AppModule {}
