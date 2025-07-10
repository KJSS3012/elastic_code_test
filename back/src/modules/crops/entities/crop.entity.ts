import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity } from "typeorm";
import { CropsInterface } from "../interfaces/crops.interface";

@Entity()
export class Crop extends CommonEntity implements CropsInterface {
  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'citext',
    nullable: false
  })
  crop_name!: string;
}
