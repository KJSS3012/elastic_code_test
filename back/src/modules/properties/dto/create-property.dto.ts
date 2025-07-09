import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreatePropertyDto {
  @ApiProperty({
    description: "Farmer ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty({ message: "Farmer ID must be provided" })
  @IsUUID()
  farmer_id!: string;

  @ApiProperty({
    description: "Farm Name",
    example: "Fazenda São João",
  })
  @IsString()
  @IsNotEmpty({ message: "Farm name must be provided" })
  farm_name!: string;

  @ApiProperty({
    description: "City",
    example: "Springfield",
  })
  @IsString()
  @IsNotEmpty({ message: "City must be provided" })
  city!: string;

  @ApiProperty({
    description: "State",
    example: "SP",
  })
  @IsString()
  @IsNotEmpty({ message: "State must be provided" })
  state!: string;

  @ApiProperty({
    description: "Total Area in Hectares",
    example: 100.5,
  })
  @IsNotEmpty({ message: "Total area must be provided" })
  @IsNumber()
  total_area_ha!: number;

  @ApiProperty({
    description: "Arable Area in Hectares",
    example: 75.0,
  })
  @IsNotEmpty({ message: "Arable area must be provided" })
  @IsNumber()
  arable_area_ha!: number;

  @ApiProperty({
    description: "Vegetable Area in Hectares",
    example: 25.5,
  })
  @IsNotEmpty({ message: "Vegetable area must be provided" })
  @IsNumber()
  vegetable_area_ha!: number;
}
