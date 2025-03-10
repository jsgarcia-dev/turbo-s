import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StoragePath } from '../storage.types';

export class ReplaceFileDto {
  @ApiProperty({
    enum: StoragePath,
    description: 'Caminho onde o novo arquivo será armazenado',
    example: 'uploads/avatars',
  })
  @IsEnum(StoragePath)
  @IsOptional()
  path: StoragePath;

  @ApiProperty({
    required: false,
    description: 'Caminho do arquivo antigo a ser substituído',
    example: 'uploads/avatars/arquivo-antigo.jpg',
  })
  @IsString()
  @IsOptional()
  oldPath?: string;
}
