import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity } from "typeorm";
import { PropertiesInterface } from "../interfaces/properties.interface";

@Entity()
export class Property extends CommonEntity implements PropertiesInterface {
  @Column({ type: 'citext', nullable: false })
  farmer_id: string;

  @Column({ type: 'citext', nullable: false })
  farm_name: string;

  @Column({ type: 'citext', nullable: false })
  city: string;

  @Column({ type: 'citext', nullable: false })
  state: string;

  @Column({ type: 'float', nullable: false })
  total_area_ha: number;

  @Column({ type: 'float', nullable: false })
  arable_area_ha: number;

  @Column({ type: 'float', nullable: false })
  vegetable_area_ha: number;
}
