import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  html?: string;
}
