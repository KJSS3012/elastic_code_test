import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFarmerPasswordDto {
  @ApiProperty({ description: 'New password', example: 'newStrongPassword123' })
  @IsString()
  password!: string;
}
