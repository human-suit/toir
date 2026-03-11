import { Module } from '@nestjs/common';
import { TestAutoController } from './testauto.controller';
import { TestAutoService } from './testauto.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestAutoController],
  providers: [TestAutoService],
})
export class TestAutoModule {}
