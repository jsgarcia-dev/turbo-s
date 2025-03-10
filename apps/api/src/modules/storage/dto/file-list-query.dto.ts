import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FileListQueryDto {
  @ApiProperty({
    description: 'Prefixo para filtrar arquivos',
    example: 'uploads/documents',
    required: false,
  })
  @IsString()
  @IsOptional()
  prefix?: string;
}
