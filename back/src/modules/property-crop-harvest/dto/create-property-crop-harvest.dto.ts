import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { CommonDto } from "src/shared/common/dto/common.dto";

export class CreatePropertyCropHarvestDto extends CommonDto {
  @ApiProperty({
    description: "Property ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsNotEmpty({ message: "Property ID must be provided" })
  @IsUUID()
  property_id!: string;

  @ApiProperty({
    description: "Harvest ID",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsNotEmpty({ message: "Harvest ID must be provided" })
  @IsUUID()
  harvest_id!: string;

  @ApiProperty({
    description: "Crop ID",
    example: "123e4567-e89b-12d3-a456-426614174002",
  })
  @IsNotEmpty({ message: "Crop ID must be provided" })
  @IsUUID()
  crop_id!: string;

  @ApiProperty({
    description: "Planted area in hectares",
    example: 10.5,
  })
  @IsNotEmpty({ message: "Planted area must be provided" })
  @IsNumber()
  planted_area_ha!: number;

  @ApiProperty({
    description: "Planting date",
    example: "2023-03-01",
  })
  @IsNotEmpty({ message: "Planting date must be provided" })
  @IsDate()
  @Type(() => Date)
  planting_date!: Date;

  @ApiProperty({
    description: "Harvest date",
    example: "2023-09-01",
  })
  @IsNotEmpty({ message: "Harvest date must be provided" })
  @IsDate()
  @Type(() => Date)
  harvest_date!: Date;
}
