import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsCPF } from 'class-validator-cpf';

export class CreateFarmerDto {
  @ApiProperty({ description: "Farmer's CPF", example: '12345678900' })
  @IsString()
  @IsNotEmpty({ message: 'CPF must be provided' })
  @IsCPF({ message: 'Invalid CPF format' })
  cpf!: string;

  @ApiPropertyOptional({
    description: "Farmer's CNPJ",
    example: '12345678000199',
  })
  @IsString()
  @MaxLength(14)
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ description: "Farmer's name", example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Producer name must be provided' })
  producer_name!: string;

  @ApiProperty({ description: "Farmer's email", example: 'john@email.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email must be provided' })
  email!: string;

  @ApiProperty({
    description: "Farmer's password",
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password must be provided' })
  password!: string;

  @ApiProperty({
    description: "Farmer's phone number",
    example: '+155599999999',
  })
  @IsString()
  @MaxLength(16)
  @IsNotEmpty({ message: 'Phone number must be provided' })
  phone!: string;
}
