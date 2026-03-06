import * as fs from 'fs';
import * as path from 'path';
import { readMeta } from './read-meta';

const MODULES_DIR = path.resolve('src/modules');

type PrismaField = {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
};

type PrismaModel = {
  name: string;
  fields: PrismaField[];
};

function lowerFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function getRelations(model: PrismaModel): string[] {
  return model.fields
    .filter((f) => f.isRelation && !f.isList)
    .map((f) => f.name);
}

function createModule(model: PrismaModel) {
  const name = model.name;
  const moduleName = name.toLowerCase();
  const modulePath = path.join(MODULES_DIR, moduleName);

  fs.mkdirSync(modulePath, { recursive: true });

  generateModule(name, moduleName, modulePath);
  generateController(name, moduleName, modulePath);
  generateService(model, moduleName, modulePath);
  generateDTO(model, moduleName, modulePath);
}

function generateDTO(
  model: PrismaModel,
  moduleName: string,
  modulePath: string,
) {
  const name = model.name;

  const dtoDir = path.join(modulePath, 'dto');
  fs.mkdirSync(dtoDir, { recursive: true });

  const createDtoPath = path.join(dtoDir, `create-${moduleName}.dto.ts`);
  const updateDtoPath = path.join(dtoDir, `update-${moduleName}.dto.ts`);

  const dtoFields = model.fields.filter((f) => {
    if (f.isRelation) return false;
    if (f.name === 'id') return false;
    if (f.name === 'createdAt') return false;
    if (f.name === 'updatedAt') return false;
    return true;
  });

  const createFields = dtoFields
    .map((f) => {
      const optional = f.isRequired ? '' : '?';
      return `  ${f.name}${optional}: ${mapType(f.type)};`;
    })
    .join('\n');

  const updateFields = dtoFields
    .map((f) => `  ${f.name}?: ${mapType(f.type)};`)
    .join('\n');

  fs.writeFileSync(
    createDtoPath,
    `export class Create${name}Dto {\n${createFields}\n}\n`,
  );

  fs.writeFileSync(
    updateDtoPath,
    `export class Update${name}Dto {\n${updateFields}\n}\n`,
  );
}

function mapType(type: string) {
  switch (type) {
    case 'Int':
      return 'number';
    case 'String':
      return 'string';
    case 'DateTime':
      return 'Date';
    case 'Boolean':
      return 'boolean';
    case 'Float':
      return 'number';
    default:
      return 'unknown';
  }
}

function generateModule(name: string, moduleName: string, modulePath: string) {
  const filePath = path.join(modulePath, `${moduleName}.module.ts`);

  const content = `import { Module } from '@nestjs/common';
import { ${name}Controller } from './${moduleName}.controller';
import { ${name}Service } from './${moduleName}.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [${name}Controller],
  providers: [${name}Service],
})
export class ${name}Module {}
`;

  fs.writeFileSync(filePath, content);
}

function generateController(
  name: string,
  moduleName: string,
  modulePath: string,
) {
  const filePath = path.join(modulePath, `${moduleName}.controller.ts`);

  const content = `import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { ${name}Service } from './${moduleName}.service';
import { Create${name}Dto } from './dto/create-${moduleName}.dto';
import { Update${name}Dto } from './dto/update-${moduleName}.dto';

@Controller('${moduleName}')
export class ${name}Controller {

  constructor(private readonly service: ${name}Service) {}

  @Get()
  async findAll(
    @Query() query: Record<string, unknown>,
    @Res({ passthrough: true }) res: Response,
  ) {

    const data = await this.service.findAll(query);

    let start = 0;
    let end = data.length ? data.length - 1 : 0;

    if (typeof query.range === 'string') {
      try {
        const parsed = JSON.parse(query.range);
        start = parsed[0];
        end = parsed[1];
      } catch {}
    }

    const total = data.length;

    res.setHeader(
      'Content-Range',
      '${moduleName} ' + start + '-' + end + '/' + total,
    );

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: Create${name}Dto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Update${name}Dto,
  ) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
`;

  fs.writeFileSync(filePath, content);
}

function generateService(
  model: PrismaModel,
  moduleName: string,
  modulePath: string,
) {
  const modelName = model.name;
  const modelLower = lowerFirst(modelName);
  const filePath = path.join(modulePath, `${moduleName}.service.ts`);

  const relations = getRelations(model);
  const relationsArray = JSON.stringify(relations);

  const content = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ${modelName} } from '@prisma/client';
import { Create${modelName}Dto } from './dto/create-${moduleName}.dto';
import { Update${modelName}Dto } from './dto/update-${moduleName}.dto';

@Injectable()
export class ${modelName}Service {

  private relations: string[] = ${relationsArray};

  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>): Promise<${modelName}[]> {

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

    const args: Prisma.${modelName}FindManyArgs = {
      where,
      skip,
      take,
      ...(orderBy && { orderBy }),
      ...(include && { include }),
    };

    return this.prisma.${modelLower}.findMany(args);
  }

  findOne(id: number): Promise<${modelName} | null> {
    return this.prisma.${modelLower}.findUnique({
      where: { id },
    });
  }

  create(dto: Create${modelName}Dto): Promise<${modelName}> {
    return this.prisma.${modelLower}.create({
      data: dto as unknown as Prisma.${modelName}CreateInput,
    });
  }

  update(id: number, dto: Update${modelName}Dto): Promise<${modelName}> {
    return this.prisma.${modelLower}.update({
      where: { id },
      data: dto as unknown as Prisma.${modelName}UpdateInput,
    });
  }

  remove(id: number): Promise<${modelName}> {
    return this.prisma.${modelLower}.delete({
      where: { id },
    });
  }
}
`;

  fs.writeFileSync(filePath, content);
}

function generateAppModule(models: PrismaModel[]) {
  const filePath = path.resolve('src/app.module.ts');

  const imports = models.map((m) => `${m.name}Module`).join(', ');

  const importLines = models
    .map(
      (m) =>
        `import { ${m.name}Module } from './modules/${m.name.toLowerCase()}/${m.name.toLowerCase()}.module';`,
    )
    .join('\n');

  const content = `import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
${importLines}

@Module({
  imports: [PrismaModule, ${imports}],
})
export class AppModule {}
`;

  fs.writeFileSync(filePath, content);
}

function main(): void {
  const models = readMeta();

  for (const model of models) {
    createModule(model);
  }

  generateAppModule(models);
}

main();
