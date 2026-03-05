import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { WorkOrderService } from './workorder.service';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';

@Controller('workorder')
export class WorkOrderController {
  constructor(private readonly service: WorkOrderService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateWorkOrderDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
