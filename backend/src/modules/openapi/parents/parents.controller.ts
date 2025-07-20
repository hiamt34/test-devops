import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  async create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  async findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parent = await this.parentsService.findOne(id);
    if (!parent) {
      throw new NotFoundException(`Parent not found`);
    }
    return parent;
  }
}
