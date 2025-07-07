import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonDto } from "src/shared/common/dto/common.dto";

export class CreateCropDto extends CommonDto {
  @ApiProperty({
    description: "Crop name",
    example: "Wheat",
  })
  @IsString()
  @IsNotEmpty({ message: "Crop name must be provided" })
  crop_name!: string;
}
