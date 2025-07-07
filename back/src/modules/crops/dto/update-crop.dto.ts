import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCropDto } from './create-crop.dto';

export class UpdateCropDto extends OmitType(PartialType(CreateCropDto), [
  'id',
  'createdAt',
  'updatedAt',
]) {
}
