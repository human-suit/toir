import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Equipment } from '@prisma/client';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {

  private relations: string[] = [];

  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>): Promise<Equipment[]> {

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

    const args: Prisma.EquipmentFindManyArgs = {
      where,
      skip,
      take,
      ...(orderBy && { orderBy }),
      ...(include && { include }),
    };

    return this.prisma.equipment.findMany(args);
  }

  findOne(id: number): Promise<Equipment | null> {
    return this.prisma.equipment.findUnique({
      where: { id },
    });
  }

  create(dto: CreateEquipmentDto): Promise<Equipment> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),...(dto.serial !== undefined && { serial: dto.serial }),
      
    };

    return this.prisma.equipment.create({
      data: data as Prisma.EquipmentCreateInput
    });
  }

  update(id: number, dto: UpdateEquipmentDto): Promise<Equipment> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),...(dto.serial !== undefined && { serial: dto.serial }),
      
    };

    return this.prisma.equipment.update({
      where: { id },
      data: data as Prisma.EquipmentUpdateInput
    });
  }

  remove(id: number): Promise<Equipment> {
    return this.prisma.equipment.delete({
      where: { id },
    });
  }
}
