import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FilePathParamDto {
  @ApiProperty({
    description: 'Caminho do arquivo',
    example: 'uploads/documents/arquivo.pdf',
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;
}
