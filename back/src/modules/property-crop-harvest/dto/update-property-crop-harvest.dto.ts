import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePropertyCropHarvestDto } from './create-property-crop-harvest.dto';

export class UpdatePropertyCropHarvestDto extends OmitType(PartialType(CreatePropertyCropHarvestDto),
  ['id', 'createdAt', 'updatedAt']) { }
