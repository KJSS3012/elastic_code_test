import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PropertiesInterface } from "../interfaces/properties.interface";
import { PropertyCropHarvest } from "../../property-crop-harvest/entities/property-crop-harvest.entity";
import { Harvest } from "../../harvests/entities/harvest.entity";

@Entity()
export class Property extends CommonEntity implements PropertiesInterface {
  @Column({ type: 'uuid', nullable: false })
  farmer_id: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false })
  farm_name: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false })
  city: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false })
  state: string;

  @Column({ type: 'float', nullable: false })
  total_area_ha: number;

  @Column({ type: 'float', nullable: false })
  arable_area_ha: number;

  @Column({ type: 'float', nullable: false })
  vegetable_area_ha: number;

  @OneToMany(() => PropertyCropHarvest, propertyCropHarvest => propertyCropHarvest.property)
  propertyCropHarvests: PropertyCropHarvest[];

  @OneToMany(() => Harvest, harvest => harvest.property)
  harvests: Harvest[];
}
