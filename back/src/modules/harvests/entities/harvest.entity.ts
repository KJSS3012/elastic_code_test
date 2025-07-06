import { CommonEntity } from "src/shared/common/entities/common.entity";
import { Column, Entity } from "typeorm";
import { HarvestInterface } from "../interfaces/harvest.interface";

@Entity()
export class Harvest extends CommonEntity implements HarvestInterface {
  @Column({ type: 'int', nullable: false })
  harvest_year: number;

  @Column({ type: 'citext', nullable: false })
  harvest_name: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;
}