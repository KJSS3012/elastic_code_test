import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { CommonDto } from "src/shared/common/dto/common.dto";

export class CreatePropertyDto extends CommonDto {
  @ApiProperty({
    description: "Farmer ID",
    example: "farmer123",
  })
  @IsString()
  @IsNotEmpty({ message: "Farmer ID must be provided" })
  @IsUUID()
  farmer_id!: string;

  @ApiProperty({
    description: "Farm Name",
    example: "John Doe",
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
    example: "Illinois",
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
