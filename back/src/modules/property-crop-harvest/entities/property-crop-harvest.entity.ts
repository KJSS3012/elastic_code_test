import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity } from "typeorm";
import { PropertyCropHarvestInterface } from "../interfaces/property-crop-harvest.interface";

@Entity()
export class PropertyCropHarvest extends CommonEntity implements PropertyCropHarvestInterface {
  @Column({ type: 'citext', nullable: false })
  property_id: string;

  @Column({ type: 'citext', nullable: false })
  harvest_id: string;

  @Column({ type: 'citext', nullable: false })
  crop_id: string;

  @Column({ type: 'int', nullable: false })
  planted_area_ha: number;

  @Column({ type: 'date', nullable: false })
  planting_date: Date;

  @Column({ type: 'date', nullable: false })
  harvest_date: Date;
}
