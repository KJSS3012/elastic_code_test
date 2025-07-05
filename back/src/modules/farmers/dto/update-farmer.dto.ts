import { PartialType } from '@nestjs/swagger';
import { CreateFarmerWithoutPasswordDto } from './create-farmer-without-password.dto';

export class UpdateFarmerDto extends PartialType(
  CreateFarmerWithoutPasswordDto,
) {}
