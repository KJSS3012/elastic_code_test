import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateHarvestDto } from "./create-harvest.dto";

export class UpdateHarvestDto extends OmitType(
  PartialType(CreateHarvestDto),
  ['id', 'createdAt', 'updatedAt']
) { }