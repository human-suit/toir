import { Module } from '@nestjs/common';
import { TestAuto3Controller } from './testauto3.controller';
import { TestAuto3Service } from './testauto3.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestAuto3Controller],
  providers: [TestAuto3Service],
})
export class TestAuto3Module {}
