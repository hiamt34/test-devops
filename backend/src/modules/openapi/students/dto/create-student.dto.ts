import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  IsEnum,
  Length,
} from 'class-validator';
import { Gender } from 'src/enums/gender';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsInt()
  currentGrade: number;

  @IsString()
  parentId: string;
}
