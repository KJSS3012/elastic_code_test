import { Exclude, Expose } from 'class-transformer';
import { CommonEntityDto } from 'src/shared/common/dto/common.entity.dto';

export class FarmerListDto extends CommonEntityDto {
  @Expose()
  producer_name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  cpf!: string;

  @Expose()
  cnpj!: string;

  @Expose()
  role!: string;
}
