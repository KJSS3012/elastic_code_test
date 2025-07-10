import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { HarvestInterface } from "../interfaces/harvest.interface";
import type { Property } from "../../properties/entities/property.entity";

@Entity()
export class Harvest extends CommonEntity implements HarvestInterface {
  @Column({ type: 'uuid', nullable: true })
  property_id: string;

  @Column({ type: 'int', nullable: false })
  harvest_year: number;

  @Column({ type: 'citext', nullable: false })
  harvest_name: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @Column({ type: 'float', nullable: true })
  total_area_ha: number;

  @ManyToOne(() => require("../../properties/entities/property.entity").Property, property => property.harvests)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}