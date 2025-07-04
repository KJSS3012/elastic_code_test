import { Exclude, Expose } from "class-transformer";
import { CommonEntityDto } from "src/shared/common/dto/common.entity.dto";

@Exclude()
export class FarmerDto extends CommonEntityDto {
  cpf!: string;
  cnpj?: string;
  password!: string;

  @Expose()
  producer_name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;
}