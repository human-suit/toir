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

import { WorkOrderService } from './workorder.service';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';

@Controller('workorder')
export class WorkOrderController {

  constructor(private readonly service: WorkOrderService) {}

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
      'workorder ' + start + '-' + end + '/' + total,
    );

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateWorkOrderDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
