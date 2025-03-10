import { ApiProperty } from '@nestjs/swagger';
import { StoragePath } from '../storage.types';

export class FileResponseDto {
  @ApiProperty({
    description: 'Chave única do arquivo no storage',
    example: 'uploads/documents/1234567890-arquivo.pdf',
  })
  key: string;

  @ApiProperty({
    description: 'URL pública do arquivo',
    example:
      'https://supabase.example.com/storage/v1/object/public/bucket/uploads/documents/1234567890-arquivo.pdf',
  })
  url: string;

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'arquivo.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'Tipo de conteúdo do arquivo',
    example: 'application/pdf',
  })
  contentType: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    enum: StoragePath,
    description: 'Caminho onde o arquivo foi armazenado',
  })
  path: StoragePath;
}
