import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends OmitType(PartialType(CreatePropertyDto),
  ['id', 'createdAt', 'updatedAt', 'farmer_id']) { }
