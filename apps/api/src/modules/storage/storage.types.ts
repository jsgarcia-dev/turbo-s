/**
 * Caminhos de armazenamento para diferentes tipos de arquivos no storage
 * @description Define os caminhos padrão onde os diferentes tipos de arquivos são armazenados
 */
export enum StoragePath {
  /**
   * Diretório para armazenamento de imagens de avatar/perfil dos usuários
   * @example 'uploads/avatars'
   */
  AVATARS = 'uploads/avatars',

  /**
   * Diretório para armazenamento de imagens de produtos
   * @example 'uploads/products'
   */
  PRODUCTS = 'uploads/products',

  /**
   * Diretório para armazenamento de documentos gerais
   * @example 'uploads/documents'
   */
  DOCUMENTS = 'uploads/documents',
}

/**
 * Códigos de erro específicos para operações de storage
 * @description Define os possíveis códigos de erro retornados pelas operações de storage
 */
export enum StorageErrorCode {
  /**
   * Erro quando o arquivo excede o tamanho máximo permitido
   */
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',

  /**
   * Erro quando o tipo de arquivo não é permitido
   */
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',

  /**
   * Erro genérico durante o upload do arquivo
   */
  UPLOAD_FAILED = 'UPLOAD_FAILED',

  /**
   * Erro quando o arquivo solicitado não foi encontrado
   */
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',

  /**
   * Erro quando o caminho de armazenamento é inválido
   */
  INVALID_PATH = 'INVALID_PATH',

  /**
   * Erro de autorização para acessar ou modificar um arquivo
   */
  UNAUTHORIZED = 'UNAUTHORIZED',
}

/**
 * Configuração para tipos de arquivo
 * @description Define as restrições e configurações para cada tipo de arquivo
 */
export interface FileTypeConfig {
  /**
   * Tamanho máximo do arquivo em bytes
   * @example 5242880 // 5MB
   */
  maxSize: number;

  /**
   * Tipos MIME permitidos
   * @example ['image/jpeg', 'image/png', 'image/gif']
   */
  allowedTypes: string[];

  /**
   * Extensões de arquivo permitidas (opcional)
   * @example ['.jpg', '.png', '.gif']
   */
  allowedExtensions?: string[];
}

export interface StorageConfig {
  paths: {
    [key in StoragePath]: FileTypeConfig;
  };
}

/**
 * Classe personalizada para erros de operações de storage
 * @description Representa erros específicos relacionados às operações de armazenamento
 */
export class StorageError extends Error {
  /**
   * Cria uma instância de erro específica para operações de storage
   * @param code - Código do erro conforme definido em StorageErrorCode
   * @param message - Mensagem descritiva do erro
   * @param details - Detalhes adicionais sobre o erro (opcional)
   */
  constructor(
    public code: StorageErrorCode,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

export interface FileMetadata {
  contentType: string;
  size: number;
  lastModified: Date;
  etag?: string;
}

// Configurações padrão para cada tipo de arquivo
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  paths: {
    [StoragePath.AVATARS]: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    },
    [StoragePath.PRODUCTS]: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    },
    [StoragePath.DOCUMENTS]: {
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      allowedExtensions: ['.pdf', '.doc', '.docx'],
    },
  },
};

// Tipo para as operações do storage
export type StorageOperation = 'upload' | 'download' | 'delete' | 'list';

// Interface para eventos de storage
export interface StorageEvent {
  operation: StorageOperation;
  path: StoragePath;
  fileName: string;
  timestamp: Date;
  success: boolean;
  error?: StorageError;
}

// Interface para estatísticas de uso
export interface StorageStats {
  totalSize: number;
  fileCount: number;
  lastUpdate: Date;
  usageByPath: {
    [key in StoragePath]?: {
      size: number;
      count: number;
    };
  };
}

/**
 * Interface para resposta de upload de arquivo
 * @description Define a estrutura de resposta quando um arquivo é enviado com sucesso
 */
export interface UploadResponse {
  /**
   * Chave única do arquivo no storage
   * @example 'uploads/avatars/1627384950-profile.jpg'
   */
  key: string;

  /**
   * URL pública para acesso ao arquivo
   * @example 'https://example.supabase.co/storage/v1/object/public/bucket/uploads/avatars/1627384950-profile.jpg'
   */
  url: string;

  /**
   * Nome original do arquivo
   * @example 'profile.jpg'
   */
  fileName: string;

  /**
   * Tipo MIME do arquivo
   * @example 'image/jpeg'
   */
  contentType: string;

  /**
   * Tamanho do arquivo em bytes
   * @example 153284
   */
  size: number;

  /**
   * Caminho onde o arquivo foi armazenado
   * @example StoragePath.AVATARS
   */
  path: StoragePath;

  /**
   * Metadados adicionais do arquivo (opcional)
   */
  metadata?: Record<string, string>;
}

export interface StorageServiceStatus {
  enabled: boolean;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
  message?: string;
}
