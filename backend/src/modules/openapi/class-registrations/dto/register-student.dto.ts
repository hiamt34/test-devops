import { IsString, Length } from 'class-validator';

export class RegisterStudentDto {
  @IsString()
  studentId: string;
}
