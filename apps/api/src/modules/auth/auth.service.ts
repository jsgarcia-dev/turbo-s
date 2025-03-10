import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@repo/database';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Método para validar o token JWT
  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      return user;
    } catch {
      return null;
    }
  }

  // Método para decodificar o token sem validar
  decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }

  // Método auxiliar para extrair o token do header Authorization
  extractTokenFromHeader(authorization: string): string | null {
    if (!authorization) return null;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
