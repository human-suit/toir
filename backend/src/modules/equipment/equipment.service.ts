import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Equipment } from '@prisma/client';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Equipment[]> {
    return this.prisma.equipment.findMany();
  }

  findOne(id: number): Promise<Equipment | null> {
    return this.prisma.equipment.findUnique({
      where: { id },
    });
  }

  create(dto: CreateEquipmentDto): Promise<Equipment> {
    return this.prisma.equipment.create({
      data: dto as unknown as Prisma.EquipmentCreateInput,
    });
  }

  update(id: number, dto: UpdateEquipmentDto): Promise<Equipment> {
    return this.prisma.equipment.update({
      where: { id },
      data: dto as unknown as Prisma.EquipmentUpdateInput,
    });
  }

  remove(id: number): Promise<Equipment> {
    return this.prisma.equipment.delete({
      where: { id },
    });
  }
}
