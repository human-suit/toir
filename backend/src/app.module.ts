import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
