import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  StoragePath,
  StorageErrorCode,
  StorageError,
  DEFAULT_STORAGE_CONFIG,
  UploadResponse,
  StorageStats,
} from './storage.types';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private readonly logger = new Logger(StorageService.name);
  private readonly supabaseUrl: string;
  private readonly bucket: string;
  private readonly projectRef: string;
  private readonly config = DEFAULT_STORAGE_CONFIG;

  private readonly cacheConfigs = {
    [StoragePath.AVATARS]: 'public, max-age=31536000', // 1 year
    [StoragePath.PRODUCTS]: 'public, max-age=86400', // 1 day
    [StoragePath.DOCUMENTS]: 'private, no-cache', // No cache for documents
  };

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const accessKeyId = this.configService.get<string>(
      'SUPABASE_S3_ACCESS_KEY',
    );
    const secretAccessKey = this.configService.get<string>(
      'SUPABASE_S3_SECRET_KEY',
    );
    this.bucket = this.configService.get<string>('SUPABASE_BUCKET');

    this.projectRef =
      this.supabaseUrl?.split('.')?.[0]?.replace('https://', '') || '';

    if (!this.supabaseUrl || !accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error('Credenciais do storage não configuradas corretamente');
    }

    this.logger.log(`Inicializando StorageService com bucket: ${this.bucket}`);

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: `${this.supabaseUrl}/storage/v1/s3`,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log('Storage Config:', {
      endpoint: `${this.supabaseUrl}/storage/v1/s3`,
      bucket: this.bucket,
      projectRef: this.projectRef,
    });
  }

  /**
   * Faz upload de um arquivo para o bucket
   */
  async uploadFile(
    file: Express.Multer.File,
    path: StoragePath,
  ): Promise<UploadResponse> {
    try {
      const pathConfig = this.config.paths[path];

      if (!pathConfig) {
        throw this.createError(
          StorageErrorCode.INVALID_PATH,
          `Path não configurado: ${path}`,
        );
      }

      if (file.size > pathConfig.maxSize) {
        throw this.createError(
          StorageErrorCode.FILE_TOO_LARGE,
          `Arquivo excede o tamanho máximo de ${pathConfig.maxSize / 1024 / 1024}MB`,
        );
      }

      if (!pathConfig.allowedTypes.includes(file.mimetype)) {
        throw this.createError(
          StorageErrorCode.INVALID_FILE_TYPE,
          `Tipo de arquivo não permitido. Permitidos: ${pathConfig.allowedTypes.join(', ')}`,
        );
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;

      const fullPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
      const key = `${fullPath}/${fileName}`;

      const cacheControl = this.cacheConfigs[path];

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: cacheControl,
          Metadata: {
            'original-name': file.originalname,
            'upload-date': new Date().toISOString(),
            'storage-path': path,
          },
        }),
      );

      const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${key}`;

      return {
        key,
        url: publicUrl,
        fileName,
        contentType: file.mimetype,
        size: file.size,
        path,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtém uma URL assinada para acesso temporário ao arquivo
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Deleta um arquivo do bucket
   */
  async deleteFile(key: string): Promise<void> {
    if (!key || key.trim() === '') {
      this.logger.error('Tentativa de excluir arquivo com chave vazia ou nula');
      throw new Error('Chave do arquivo não fornecida');
    }

    try {
      this.logger.log(`Iniciando exclusão do arquivo: ${key}`);

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      this.logger.log(`Arquivo excluído com sucesso: ${key}`);
    } catch (error) {
      const errorDetails = {
        bucket: this.bucket,
        key,
        errorMessage: error.message,
        errorCode: error.$metadata?.httpStatusCode,
      };

      this.logger.error(
        `Erro ao excluir arquivo: ${JSON.stringify(errorDetails)}`,
        error.stack,
      );

      if (error.$metadata?.httpStatusCode === 404) {
        this.logger.warn(`Arquivo não encontrado para exclusão: ${key}`);
        return;
      }

      throw error;
    }
  }

  /**
   * Lista arquivos em um diretório
   */
  async listFiles(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    return response.Contents?.map((item) => item.Key) || [];
  }

  /**
   * Obtém um arquivo do bucket
   */
  async getFile(key: string): Promise<{ buffer: Buffer; contentType: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const contentType = response.ContentType || 'application/octet-stream';

      const bodyContents = await response.Body.transformToByteArray();
      return {
        buffer: Buffer.from(bodyContents),
        contentType,
      };
    } catch (error) {
      this.logger.error(`Erro ao obter arquivo: ${key}`, error.stack);
      throw error;
    }
  }

  async getPublicUrl(key: string): Promise<string> {
    return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${key}`;
  }

  getBucketName(): string {
    return this.bucket;
  }

  private createError(
    code: StorageErrorCode,
    message: string,
    details?: any,
  ): StorageError {
    return new StorageError(code, message, details);
  }

  private handleError(error: any): StorageError {
    if (error.code && Object.values(StorageErrorCode).includes(error.code)) {
      return error as StorageError;
    }

    return this.createError(
      StorageErrorCode.UPLOAD_FAILED,
      'Erro interno no storage',
      error,
    );
  }

  async getStats(): Promise<StorageStats> {
    return {
      totalSize: 0,
      fileCount: 0,
      lastUpdate: new Date(),
      usageByPath: {},
    };
  }

  async replaceFile(
    file: Express.Multer.File,
    oldPath: string | null,
    path: StoragePath,
  ): Promise<UploadResponse> {
    try {
      const pathConfig = this.config.paths[path];

      if (!pathConfig) {
        throw this.createError(
          StorageErrorCode.INVALID_PATH,
          `Path não configurado: ${path}`,
        );
      }

      if (file.size > pathConfig.maxSize) {
        throw this.createError(
          StorageErrorCode.FILE_TOO_LARGE,
          `Arquivo excede o tamanho máximo de ${pathConfig.maxSize / 1024 / 1024}MB`,
        );
      }

      if (!pathConfig.allowedTypes.includes(file.mimetype)) {
        throw this.createError(
          StorageErrorCode.INVALID_FILE_TYPE,
          `Tipo de arquivo não permitido. Permitidos: ${pathConfig.allowedTypes.join(', ')}`,
        );
      }

      if (oldPath) {
        try {
          await this.deleteFile(oldPath);
        } catch (error) {
          this.logger.warn(`Erro ao deletar arquivo antigo ${oldPath}:`, error);
        }
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const key = `${path}/${fileName}`;

      const cacheControl = this.cacheConfigs[path];

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: cacheControl,
          Metadata: {
            'original-name': file.originalname,
            'upload-date': new Date().toISOString(),
            'storage-path': path,
          },
        }),
      );

      const url = await this.getPublicUrl(key);

      return {
        key,
        url,
        fileName,
        contentType: file.mimetype,
        size: file.size,
        path,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
