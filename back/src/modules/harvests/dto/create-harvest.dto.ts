import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonDto } from "src/shared/common/dto/common.dto";

export class CreateHarvestDto extends CommonDto {
  @ApiProperty({
    description: "Harvest year",
    example: 2023,
  })
  @IsNotEmpty({ message: "Harvest year must be provided" })
  @IsNumber()
  harvest_year!: number;

  @ApiProperty({
    description: "Harvest name",
    example: "Spring Harvest",
  })
  @IsNotEmpty({ message: "Harvest name must be provided" })
  @IsString()
  harvest_name!: string;

  @ApiProperty({
    description: "Harvest start date",
    example: "2023-01-01",
  })
  @IsNotEmpty({ message: "Harvest start date must be provided" })
  @IsDate()
  @Type(() => Date)
  start_date!: Date;

  @ApiProperty({
    description: "Harvest end date",
    example: "2023-12-31",
  })
  @IsNotEmpty({ message: "Harvest end date must be provided" })
  @IsDate()
  @Type(() => Date)
  end_date!: Date;
}