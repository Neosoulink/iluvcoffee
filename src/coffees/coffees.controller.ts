import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll() {
    return 'All coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Retrieved id: #${id}`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }
}
