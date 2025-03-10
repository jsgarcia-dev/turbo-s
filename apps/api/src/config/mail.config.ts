import { z } from 'zod';

export const mailConfigSchema = z.object({
  MAIL_HOST: z.string().default('smtp.ethereal.email'),
  MAIL_PORT: z.string().transform(Number).default('587'),
  MAIL_USER: z.string().default('watson.stehr37@ethereal.email'),
  MAIL_PASS: z.string().default('ngJMd6zVwXk561rD49'),
  MAIL_FROM: z.string().default('watson.stehr37@ethereal.email'),
});

export type MailConfig = z.infer<typeof mailConfigSchema>;
