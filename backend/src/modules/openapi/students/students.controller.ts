import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student not found`);
    }
    return student;
  }
}
