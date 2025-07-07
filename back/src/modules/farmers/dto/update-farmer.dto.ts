import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFarmerWithoutPasswordDto } from './create-farmer-without-password.dto';

export class UpdateFarmerDto extends OmitType(PartialType(
  CreateFarmerWithoutPasswordDto),
  ['id', 'createdAt', 'updatedAt'])
{ }
