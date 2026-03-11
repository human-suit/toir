import { Module } from '@nestjs/common';
import { TestAuto4Controller } from './testauto4.controller';
import { TestAuto4Service } from './testauto4.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestAuto4Controller],
  providers: [TestAuto4Service],
})
export class TestAuto4Module {}
