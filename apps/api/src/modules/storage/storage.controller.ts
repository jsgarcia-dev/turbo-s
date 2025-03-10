import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Logger,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { Response } from 'express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Throttle } from '@nestjs/throttler';
import { StoragePath, StorageServiceStatus } from './storage.types';
import {
  UploadOptionsDto,
  FileListQueryDto,
  ReplaceFileDto,
  FileResponseDto,
} from './dto';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);
  private serviceStatus: StorageServiceStatus = {
    enabled: true,
    lastUpdatedAt: new Date(),
    lastUpdatedBy: 'system',
  };

  constructor(private readonly storageService: StorageService) {}

  @Get('test')
  @Public()
  @ApiOperation({
    summary: 'Testar o módulo de storage',
    description:
      'Endpoint para verificar se o módulo de storage está funcionando corretamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'O módulo de storage está funcionando corretamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Storage module está funcionando!',
        },
      },
    },
  })
  async testStorageModule() {
    return { message: 'Storage module está funcionando!' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Fazer upload de arquivo',
    description:
      'Faz upload de um arquivo para o bucket do Supabase Storage. Possui limite de 10 requisições por minuto.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo a ser enviado',
        },
        path: {
          type: 'string',
          description: 'Caminho onde o arquivo será armazenado',
          enum: Object.values(StoragePath),
          default: StoragePath.DOCUMENTS,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadOptions: UploadOptionsDto,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new HttpException(
        'Nenhum arquivo recebido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.storageService.uploadFile(
        file,
        uploadOptions.path,
      );

      return {
        key: result.key,
        url: result.url,
        fileName: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        path: uploadOptions.path,
      };
    } catch (error) {
      console.error('Erro detalhado no upload:', error);
      throw new HttpException(
        `Erro no upload: ${error.message || 'Erro desconhecido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('files')
  @Public()
  @ApiOperation({
    summary: 'Listar arquivos',
    description:
      'Lista todos os arquivos em um diretório específico do storage.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de arquivos retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'uploads/documents/file1.pdf',
            'uploads/documents/file2.jpg',
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Prefixo inválido' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async listFiles(@Query() query: FileListQueryDto) {
    try {
      if (
        query.prefix &&
        !Object.values(StoragePath).some((path) =>
          query.prefix.startsWith(path),
        )
      ) {
        throw new HttpException(
          'Prefixo inválido para listagem',
          HttpStatus.BAD_REQUEST,
        );
      }

      const files = await this.storageService.listFiles(query.prefix);
      return { files };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Erro ao listar arquivos com prefixo ${query.prefix}:`,
        error,
      );
      throw new HttpException(
        `Erro ao listar arquivos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('file/*filePath')
  @Public()
  @ApiOperation({
    summary: 'Obter arquivo',
    description: 'Retorna o conteúdo do arquivo especificado pelo caminho.',
  })
  @ApiResponse({ status: 200, description: 'Arquivo obtido com sucesso' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado' })
  async getFile(@Param('filePath') filePath: string, @Res() res: Response) {
    try {
      const { buffer, contentType } =
        await this.storageService.getFile(filePath);

      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${filePath.split('/').pop()}"`,
      );
      res.send(buffer);
    } catch (error) {
      res.status(404).send({
        message: 'Arquivo não encontrado',
        error: error.message,
      });
    }
  }

  @Get('url/*filePath')
  @Public()
  @ApiOperation({
    summary: 'Obter URL assinada',
    description: 'Gera uma URL assinada para acesso temporário ao arquivo.',
  })
  @ApiResponse({
    status: 200,
    description: 'URL assinada gerada com sucesso',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://supabase.example.com/storage/v1/signed/...',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async getSignedUrl(
    @Param('filePath') filePath: string,
    @Query('expiresIn') expiresIn = 3600,
  ) {
    try {
      const url = await this.storageService.getSignedUrl(filePath, +expiresIn);
      return { url };
    } catch (error) {
      throw new HttpException(
        `Erro ao obter URL assinada: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('file/*filePath')
  @Public()
  @ApiOperation({
    summary: 'Excluir arquivo',
    description: 'Remove um arquivo do bucket do Supabase Storage.',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo excluído com sucesso ou já não existe',
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async deleteFile(@Param('filePath') filePath: string) {
    try {
      this.logger.log(`Recebida solicitação para excluir arquivo: ${filePath}`);

      await this.storageService.deleteFile(filePath);
      return {
        success: true,
        message: 'Arquivo excluído com sucesso',
        path: filePath,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message && error.message.includes('NoSuchKey')) {
        return {
          success: true,
          message: 'Arquivo já não existe ou foi previamente removido',
          path: filePath,
        };
      }

      throw new HttpException(
        `Erro ao excluir arquivo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('replace')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Substituir arquivo',
    description:
      'Substitui um arquivo existente por um novo, excluindo o arquivo antigo automaticamente.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Novo arquivo que substituirá o antigo',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo substituído com sucesso',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async replaceFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() replaceOptions: ReplaceFileDto,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new HttpException(
        'Nenhum arquivo recebido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const path = replaceOptions.path || StoragePath.DOCUMENTS;

      const result = await this.storageService.replaceFile(
        file,
        replaceOptions.oldPath,
        path,
      );

      return {
        key: result.key,
        url: result.url,
        fileName: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        path: path,
      };
    } catch (error) {
      console.error('Erro detalhado na substituição:', error);
      throw new HttpException(
        `Erro na substituição: ${error.message || 'Erro desconhecido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
