import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve('prisma/schema.prisma');
const MODULES_DIR = path.resolve('src/modules');

function getModels(schema: string): string[] {
  const regex = /model\s+(\w+)\s+\{/g;

  const models: string[] = [];
  let match;

  while ((match = regex.exec(schema)) !== null) {
    models.push(match[1]);
  }

  return models;
}

function createModule(name: string) {
  const moduleName = name.toLowerCase();
  const modulePath = path.join(MODULES_DIR, moduleName);

  fs.mkdirSync(modulePath, { recursive: true });

  generateModule(name, moduleName, modulePath);
  generateController(name, moduleName, modulePath);
  generateService(name, moduleName, modulePath);
}

function generateModule(name: string, moduleName: string, modulePath: string) {
  const filePath = path.join(modulePath, `${moduleName}.module.ts`);

  const content = `import { Module } from '@nestjs/common';
import { ${name}Controller } from './${moduleName}.controller';
import { ${name}Service } from './${moduleName}.service';

@Module({
  controllers: [${name}Controller],
  providers: [${name}Service],
})
export class ${name}Module {}
`;

  fs.writeFileSync(filePath, content);
  console.log('Created module:', filePath);
}

function generateController(
  name: string,
  moduleName: string,
  modulePath: string,
) {
  const filePath = path.join(modulePath, `${moduleName}.controller.ts`);

  const content = `import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ${name}Service } from './${moduleName}.service';

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
  create(@Body() data: unknown) {
    return this.service.create(data);
  }
}
`;

  fs.writeFileSync(filePath, content);
  console.log('Created controller:', filePath);
}

function generateService(name: string, moduleName: string, modulePath: string) {
  const filePath = path.join(modulePath, `${moduleName}.service.ts`);

  const content = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ${name}Service {

  constructor(private prisma: PrismaService) {}

  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    return this.prisma.${moduleName}.findMany();
  }

  findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    return this.prisma.${moduleName}.findUnique({
      where: { id },
    });
  }

  create(data: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    return this.prisma.${moduleName}.create({
      data: data as any,
    });
  }

}
`;

  fs.writeFileSync(filePath, content);
  console.log('Created service:', filePath);
}

function main() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const models = getModels(schema);

  const model = models.find((m) => m === 'Equipment');

  if (!model) {
    console.log('Model Equipment not found');
    return;
  }

  createModule(model);
}

main();
