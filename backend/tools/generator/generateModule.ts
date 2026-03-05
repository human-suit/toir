import * as fs from 'fs';
import * as path from 'path';
import { getDMMF } from '@prisma/internals';

const schemaPath = path.resolve('prisma/schema.prisma');
const MODULES_DIR = path.resolve('src/modules');

type PrismaField = {
  name: string;
  type: string;
  kind: string;
  isRequired: boolean;
  isList: boolean;
  isId: boolean;
};

type PrismaModel = {
  name: string;
  fields: PrismaField[];
};

function lowerFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function getModels(): Promise<PrismaModel[]> {
  const schema = fs.readFileSync(schemaPath, 'utf8');

  const dmmf = await getDMMF({
    datamodel: schema,
  });

  return dmmf.datamodel.models as unknown as PrismaModel[];
}

function generateMeta(models: PrismaModel[]) {
  const meta = models.map((model) => ({
    name: model.name,
    fields: model.fields.map((f) => ({
      name: f.name,
      type: String(f.type),
      isRequired: f.isRequired,
      isList: f.isList,
      isRelation: f.kind === 'object',
    })),
  }));

  const outDir = path.resolve('generated');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(meta, null, 2),
  );
}

function createModule(model: PrismaModel) {
  const name = model.name;
  const moduleName = name.toLowerCase();
  const modulePath = path.join(MODULES_DIR, moduleName);

  fs.mkdirSync(modulePath, { recursive: true });

  generateModule(name, moduleName, modulePath);
  generateController(name, moduleName, modulePath);
  generateService(name, moduleName, modulePath);
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

  const scalarFields = model.fields.filter(
    (f) =>
      f.kind === 'scalar' &&
      !f.isId &&
      f.name !== 'createdAt' &&
      f.name !== 'updatedAt',
  );

  const createFields = scalarFields
    .map((f) => {
      const optional = f.isRequired ? '' : '?';
      return `  ${f.name}${optional}: ${mapType(f.type)};`;
    })
    .join('\n');

  const updateFields = scalarFields
    .map((f) => {
      return `  ${f.name}?: ${mapType(f.type)};`;
    })
    .join('\n');

  const createContent = `export class Create${name}Dto {
${createFields}
}
`;

  const updateContent = `export class Update${name}Dto {
${updateFields}
}
`;

  fs.writeFileSync(createDtoPath, createContent);
  fs.writeFileSync(updateDtoPath, updateContent);
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
      return 'any';
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
} from '@nestjs/common';
import { ${name}Service } from './${moduleName}.service';
import { Create${name}Dto } from './dto/create-${moduleName}.dto';
import { Update${name}Dto } from './dto/update-${moduleName}.dto';

@Controller('${moduleName}')
export class ${name}Controller {
  constructor(private readonly service: ${name}Service) {}

  @Get()
  findAll() {
    return this.service.findAll();
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
  update(@Param('id') id: string, @Body() dto: Update${name}Dto) {
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
  model: string,
  moduleName: string,
  modulePath: string,
) {
  const modelLower = lowerFirst(model);
  const filePath = path.join(modulePath, `${moduleName}.service.ts`);

  const content = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ${model} } from '@prisma/client';
import { Create${model}Dto } from './dto/create-${moduleName}.dto';
import { Update${model}Dto } from './dto/update-${moduleName}.dto';

@Injectable()
export class ${model}Service {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<${model}[]> {
    return this.prisma.${modelLower}.findMany();
  }

  findOne(id: number): Promise<${model} | null> {
    return this.prisma.${modelLower}.findUnique({
      where: { id },
    });
  }

  create(dto: Create${model}Dto): Promise<${model}> {
    return this.prisma.${modelLower}.create({
      data: dto as unknown as Prisma.${model}CreateInput,
    });
  }

  update(id: number, dto: Update${model}Dto): Promise<${model}> {
    return this.prisma.${modelLower}.update({
      where: { id },
      data: dto as unknown as Prisma.${model}UpdateInput,
    });
  }

  remove(id: number): Promise<${model}> {
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

async function main() {
  const models = await getModels();

  console.log(
    'Models:',
    models.map((m) => m.name),
  );

  generateMeta(models);

  for (const model of models) {
    createModule(model);
  }

  generateAppModule(models);
}

main();
