import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, TestAuto3 } from '@prisma/client';
import { CreateTestAuto3Dto } from './dto/create-testauto3.dto';
import { UpdateTestAuto3Dto } from './dto/update-testauto3.dto';

@Injectable()
export class TestAuto3Service {

  private relations: string[] = [];

  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>): Promise<TestAuto3[]> {

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

    const args: Prisma.TestAuto3FindManyArgs = {
      where,
      skip,
      take,
      ...(orderBy && { orderBy }),
      ...(include && { include }),
    };

    return this.prisma.testAuto3.findMany(args);
  }

  findOne(id: number): Promise<TestAuto3 | null> {
    return this.prisma.testAuto3.findUnique({
      where: { id },
    });
  }

  create(dto: CreateTestAuto3Dto): Promise<TestAuto3> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),
      
    };

    return this.prisma.testAuto3.create({
      data: data as Prisma.TestAuto3CreateInput
    });
  }

  update(id: number, dto: UpdateTestAuto3Dto): Promise<TestAuto3> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),
      
    };

    return this.prisma.testAuto3.update({
      where: { id },
      data: data as Prisma.TestAuto3UpdateInput
    });
  }

  remove(id: number): Promise<TestAuto3> {
    return this.prisma.testAuto3.delete({
      where: { id },
    });
  }
}
