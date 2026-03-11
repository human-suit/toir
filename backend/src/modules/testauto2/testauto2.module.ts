import { Module } from '@nestjs/common';
import { TestAuto2Controller } from './testauto2.controller';
import { TestAuto2Service } from './testauto2.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestAuto2Controller],
  providers: [TestAuto2Service],
})
export class TestAuto2Module {}
