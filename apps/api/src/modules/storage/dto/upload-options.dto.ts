import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StoragePath } from '../storage.types';

export class UploadOptionsDto {
  @ApiProperty({
    enum: StoragePath,
    default: StoragePath.DOCUMENTS,
    description: 'Caminho onde o arquivo será armazenado',
  })
  @IsEnum(StoragePath)
  @IsOptional()
  path: StoragePath = StoragePath.DOCUMENTS;
}
