import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { TestAuto3Service } from './testauto3.service';
import { CreateTestAuto3Dto } from './dto/create-testauto3.dto';
import { UpdateTestAuto3Dto } from './dto/update-testauto3.dto';

@Controller('testauto3')
export class TestAuto3Controller {

  constructor(private readonly service: TestAuto3Service) {}

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
      'testauto3 ' + start + '-' + end + '/' + total,
    );

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateTestAuto3Dto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestAuto3Dto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
