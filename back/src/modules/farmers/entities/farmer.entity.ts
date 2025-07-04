import { CommonEntity } from "src/shared/common/entities/common.entity";
import { FarmerInterface } from "../interface/farmer.interface";
import { Column, Entity, Unique } from "typeorm";

@Entity()
@Unique(["cpf", "cnpj", "email"])
export class Farmer extends CommonEntity implements FarmerInterface {

  @Column({type: "citext", nullable: false})
  cpf: string;

  @Column({type: "citext", nullable: true})
  cnpj: string;

  @Column({type: "citext", nullable: false})
  producer_name: string;

  @Column({type: "citext", nullable: false})
  email: string;

  @Column({ type: "text", nullable: false })
  password: string;

  @Column({type: "citext", nullable: false})
  phone: string;
}