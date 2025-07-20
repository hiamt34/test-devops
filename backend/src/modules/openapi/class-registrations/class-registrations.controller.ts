import {
  Controller,
  Post,
  Body,
  Param,
  ConflictException,
} from '@nestjs/common';
import { ClassRegistrationsService } from './class-registrations.service';
import { RegisterStudentDto } from './dto/register-student.dto';

@Controller('classes')
export class ClassRegistrationsController {
  constructor(
    private readonly classRegistrationsService: ClassRegistrationsService,
  ) {}

  @Post(':classId/register')
  async register(
    @Param('classId') classId: string,
    @Body() registerStudentDto: RegisterStudentDto,
  ) {
    return this.classRegistrationsService.register(classId, registerStudentDto);
  }
}
