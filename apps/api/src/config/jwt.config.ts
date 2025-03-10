import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  signOptions: {
    algorithm: 'ES256',
  },
};
