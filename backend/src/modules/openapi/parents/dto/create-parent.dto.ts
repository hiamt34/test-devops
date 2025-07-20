import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateParentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;
}
