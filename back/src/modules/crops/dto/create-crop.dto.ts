import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCropDto {
  @ApiProperty({
    description: "Crop name",
    example: "Wheat",
  })
  @IsString()
  @IsNotEmpty({ message: "Crop name must be provided" })
  crop_name!: string;
}
