import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, WorkOrder } from '@prisma/client';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';

@Injectable()
export class WorkOrderService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<WorkOrder[]> {
    return this.prisma.workOrder.findMany();
  }

  findOne(id: number): Promise<WorkOrder | null> {
    return this.prisma.workOrder.findUnique({
      where: { id },
    });
  }

  create(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    return this.prisma.workOrder.create({
      data: dto as unknown as Prisma.WorkOrderCreateInput,
    });
  }

  update(id: number, dto: UpdateWorkOrderDto): Promise<WorkOrder> {
    return this.prisma.workOrder.update({
      where: { id },
      data: dto as unknown as Prisma.WorkOrderUpdateInput,
    });
  }

  remove(id: number): Promise<WorkOrder> {
    return this.prisma.workOrder.delete({
      where: { id },
    });
  }
}
