import { CommonEntity } from 'src/shared/common/entities/common.entity';
import { FarmerInterface } from '../interface/farmer.interface';
import { Column, Entity } from 'typeorm';

@Entity()
export class Farmer extends CommonEntity implements FarmerInterface {
  @Column({ type: 'citext', nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'citext', nullable: true, unique: true })
  cnpj: string;

  @Column({ type: 'citext', nullable: false })
  producer_name: string;

  @Column({ type: 'citext', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'citext', nullable: false })
  phone: string;

  @Column({ type: 'citext', nullable: false, default: 'farmer' })
  role: string;
}
