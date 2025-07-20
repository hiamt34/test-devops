import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto, GetClassByDayDto } from './dto/create-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  async findByDay(@Query() { day }: GetClassByDayDto) {
    return this.classesService.findByDay(day);
  }

  @Get('/all')
  async findAll() {
    return this.classesService.findAll();
  }
}
