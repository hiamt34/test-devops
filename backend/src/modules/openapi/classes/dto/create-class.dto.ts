import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Max,
  Min,
  Matches,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TIME_SLOT_REGEX } from 'src/constants/regex';
import { IsTimeSlot } from 'src/decorators/timeslot.decorator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsInt()
  @Max(6)
  @Min(0)
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  @IsTimeSlot()
  timeSlot: string;

  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsInt()
  @IsNotEmpty()
  maxStudents: number;
}

export class GetClassByDayDto {
  @IsInt()
  @Max(6)
  @Min(0)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && !Number.isNaN(+value) ? +value : undefined,
  )
  day?: number;
}
