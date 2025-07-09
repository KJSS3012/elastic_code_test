import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { PropertyCropHarvestInterface } from "../interfaces/property-crop-harvest.interface";
import { Property } from "../../properties/entities/property.entity";
import { Harvest } from "../../harvests/entities/harvest.entity";
import { Crop } from "../../crops/entities/crop.entity";

@Entity()
export class PropertyCropHarvest extends CommonEntity implements PropertyCropHarvestInterface {
  @Column({ type: 'uuid', nullable: false })
  property_id: string;

  @Column({ type: 'uuid', nullable: false })
  harvest_id: string;

  @Column({ type: 'uuid', nullable: false })
  crop_id: string;

  @Column({ type: 'int', nullable: false })
  planted_area_ha: number;

  @Column({ type: 'date', nullable: false })
  planting_date: Date;

  @Column({ type: 'date', nullable: false })
  harvest_date: Date;

  @ManyToOne(() => Property, property => property.propertyCropHarvests)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Harvest)
  @JoinColumn({ name: 'harvest_id' })
  harvest: Harvest;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;
}
