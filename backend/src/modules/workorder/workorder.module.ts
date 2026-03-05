import { Module } from '@nestjs/common';
import { WorkOrderController } from './workorder.controller';
import { WorkOrderService } from './workorder.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
})
export class WorkOrderModule {}
