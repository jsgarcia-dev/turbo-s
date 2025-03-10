import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { prisma } from '@repo/database';
import * as jose from 'node-jose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, token, done) => {
        try {
          const jwk = await prisma.jwks.findFirst({
            orderBy: { createdAt: 'desc' },
          });

          const keystore = jose.JWK.createKeyStore();
          const key = await keystore.add(JSON.parse(jwk.publicKey), 'pem');
          const publicKey = key.toPEM(false);

          done(null, publicKey);
        } catch (err) {
          done(err);
        }
      },
      algorithms: ['ES256'],
    });
  }

  async validate(payload: any) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
