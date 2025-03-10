import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@repo/database';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  name?: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ required: false })
  image?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
