import { z } from 'zod';
import { mailConfigSchema } from './mail.config';
import { storageConfigSchema } from './storage.config';

const envSchema = z.object({
  // API
  PORT: z.string().default('3001'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // API Prefix
  API_PREFIX: z.string().default('api'),

  // Swagger
  SWAGGER_PATH: z.string().default('docs'),

  // Rate Limiting
  THROTTLE_TTL: z.string().transform(Number).default('60000'),
  THROTTLE_LIMIT: z.string().transform(Number).default('100'),

  // Email
  ...mailConfigSchema.shape,

  // Supabase Storage
  ...storageConfigSchema.shape,
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = () => {
  console.log('==== Environment ====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Current working directory:', process.cwd());
  console.log('===================');

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Variáveis de ambiente inválidas:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Variáveis de ambiente inválidas');
  }

  return parsed.data;
};
