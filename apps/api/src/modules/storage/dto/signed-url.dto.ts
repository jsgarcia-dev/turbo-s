import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { FilePathParamDto } from './file-path-param.dto';

export class SignedUrlDto extends FilePathParamDto {
  @ApiProperty({
    description: 'Tempo de expiração da URL em segundos',
    default: 3600,
    required: false,
    example: 3600,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(86400)
  expiresIn: number = 3600;
}
