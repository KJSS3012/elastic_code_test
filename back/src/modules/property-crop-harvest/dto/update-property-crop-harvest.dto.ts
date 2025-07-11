import { PartialType } from '@nestjs/swagger';
import { CreatePropertyCropHarvestDto } from './create-property-crop-harvest.dto';

export class UpdatePropertyCropHarvestDto extends PartialType(CreatePropertyCropHarvestDto) {
}
