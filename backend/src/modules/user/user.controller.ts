import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

  constructor(private readonly service: UserService) {}

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
      'user ' + start + '-' + end + '/' + total,
    );

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
