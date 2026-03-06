import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, WorkOrder } from '@prisma/client';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';

@Injectable()
export class WorkOrderService {

  private relations: string[] = ["equipment"];

  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>): Promise<WorkOrder[]> {

    const where: Record<string, unknown> = {};
    let include: Record<string, boolean> | undefined;
    let orderBy: Record<string, 'asc' | 'desc'> | undefined;

    let skip = 0;
    let take = 50;

    for (const key of Object.keys(query)) {

      const raw = query[key];
      if (typeof raw !== 'string') continue;

      const value = raw;

      if (key === 'filter') {
        try {
          const parsed = JSON.parse(value);
          Object.assign(where, parsed);
        } catch {}
        continue;
      }

      if (key === 'range') {
        try {
          const [start, end] = JSON.parse(value);
          skip = start;
          take = end - start + 1;
        } catch {}
        continue;
      }

      if (key === 'sort') {
        try {
          const [field, direction] = JSON.parse(value);
          orderBy = {
            [field]: direction === 'DESC' ? 'desc' : 'asc',
          };
        } catch {}
        continue;
      }

      if (key === 'include') {
        const requested = value.split(',');
        include = {};

        for (const r of requested) {
          if (this.relations.includes(r)) {
            include[r] = true;
          }
        }

        continue;
      }

      if (value.startsWith('like:')) {
        where[key] = {
          contains: value.replace('like:', ''),
          mode: 'insensitive',
        };
      } else if (!isNaN(Number(value))) {
        where[key] = Number(value);
      } else {
        where[key] = value;
      }
    }

    const args: Prisma.WorkOrderFindManyArgs = {
      where,
      skip,
      take,
      ...(orderBy && { orderBy }),
      ...(include && { include }),
    };

    return this.prisma.workOrder.findMany(args);
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
