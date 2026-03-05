import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { WorkOrderModule } from './modules/workorder/workorder.module';

@Module({
  imports: [PrismaModule, UserModule, EquipmentModule, WorkOrderModule],
})
export class AppModule {}
