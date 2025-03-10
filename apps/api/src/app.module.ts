import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { UsersModule } from './modules/users/users.module';
import { validateEnv } from './config/env.config';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env.development', '.env'],
      expandVariables: true,
      cache: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: false,
      },
    }),
    UsersModule,
    MailModule,
    AuthModule,
    StorageModule,
    ThrottlerModule.forRoot([
      {
        ttl: process.env.THROTTLE_TTL
          ? parseInt(process.env.THROTTLE_TTL)
          : 60000,
        limit: process.env.THROTTLE_LIMIT
          ? parseInt(process.env.THROTTLE_LIMIT)
          : 100,
      },
    ]),
    WinstonModule.forRoot(loggerConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
