import { Injectable, Logger } from '@nestjs/common';
import { prisma, User } from '@repo/database';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Buscando todos os usuários');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return users as User[];
    } catch (error) {
      this.logger.error('Erro ao buscar usuários:', error.message);
      throw error;
    }
  }
}
