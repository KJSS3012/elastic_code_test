import { CommonEntity } from 'src/shared/common/entities/common.entity';
import { FarmerInterface } from '../interface/farmer.interface';
import { Column, Entity } from 'typeorm';

@Entity()
export class Farmer extends CommonEntity implements FarmerInterface {
  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: true, unique: true })
  cpf: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: true, unique: true })
  cnpj: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false })
  producer_name: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false })
  phone: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'text' : 'citext', nullable: false, default: 'farmer' })
  role: string;
}
