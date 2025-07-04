import { IsEmail, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFarmerDto {
  @ApiProperty({ description: "Farmer's CPF", example: "12345678900" })
  @IsString({})
  @MaxLength(11)
  cpf!: string;

  @ApiPropertyOptional({ description: "Farmer's CNPJ", example: "12345678000199" })
  @IsString()
  @MaxLength(14)
  cnpj?: string;

  @ApiProperty({ description: "Farmer's name", example: "John Doe" })
  @IsString()
  producerName!: string;

  @ApiProperty({ description: "Farmer's email", example: "john@email.com" })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Farmer's password", example: "securePassword123" })
  @IsString()
  password!: string;

  @ApiProperty({ description: "Farmer's phone number", example: "+155599999999" })
  @IsString()
  @MaxLength(16)
  phone!: string;
}