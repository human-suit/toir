import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, TestAuto2 } from '@prisma/client';
import { CreateTestAuto2Dto } from './dto/create-testauto2.dto';
import { UpdateTestAuto2Dto } from './dto/update-testauto2.dto';

@Injectable()
export class TestAuto2Service {

  private relations: string[] = [];

  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>): Promise<TestAuto2[]> {

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

    const args: Prisma.TestAuto2FindManyArgs = {
      where,
      skip,
      take,
      ...(orderBy && { orderBy }),
      ...(include && { include }),
    };

    return this.prisma.testAuto2.findMany(args);
  }

  findOne(id: number): Promise<TestAuto2 | null> {
    return this.prisma.testAuto2.findUnique({
      where: { id },
    });
  }

  create(dto: CreateTestAuto2Dto): Promise<TestAuto2> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),
      
    };

    return this.prisma.testAuto2.create({
      data: data as Prisma.TestAuto2CreateInput
    });
  }

  update(id: number, dto: UpdateTestAuto2Dto): Promise<TestAuto2> {

    const data = {
      ...(dto.name !== undefined && { name: dto.name }),
      
    };

    return this.prisma.testAuto2.update({
      where: { id },
      data: data as Prisma.TestAuto2UpdateInput
    });
  }

  remove(id: number): Promise<TestAuto2> {
    return this.prisma.testAuto2.delete({
      where: { id },
    });
  }
}
