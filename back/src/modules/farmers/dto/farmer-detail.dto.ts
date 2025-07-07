import { Exclude, Expose } from 'class-transformer';
import { CommonEntityDto } from 'src/shared/common/dto/common.entity.dto';

@Exclude()
export class FarmerDetailDto extends CommonEntityDto {

  @Expose()
  cpf!: string;

  @Expose()
  cnpj?: string;

  @Expose()
  producer_name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;
}
