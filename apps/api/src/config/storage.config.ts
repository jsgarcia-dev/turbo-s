import { z } from 'zod';

export const storageConfigSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_STORAGE_URL: z.string(),
  SUPABASE_S3_ACCESS_KEY: z.string(),
  SUPABASE_S3_SECRET_KEY: z.string(),
  SUPABASE_BUCKET: z.string(),
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export const getStorageConfig = (
  config: Record<string, unknown>,
): StorageConfig => {
  return {
    SUPABASE_URL: config.SUPABASE_URL as string,
    SUPABASE_STORAGE_URL: config.SUPABASE_STORAGE_URL as string,
    SUPABASE_S3_ACCESS_KEY: config.SUPABASE_S3_ACCESS_KEY as string,
    SUPABASE_S3_SECRET_KEY: config.SUPABASE_S3_SECRET_KEY as string,
    SUPABASE_BUCKET: config.SUPABASE_BUCKET as string,
  };
};
