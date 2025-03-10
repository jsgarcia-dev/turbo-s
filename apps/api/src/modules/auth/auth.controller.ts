import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('test-public')
  testPublic() {
    return { message: 'Esta é uma rota pública' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get('test-protected')
  testProtected() {
    return { message: 'Esta é uma rota protegida apenas para administradores' };
  }
}
