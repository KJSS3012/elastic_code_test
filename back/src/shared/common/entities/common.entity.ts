import { ApiProperty } from '@nestjs/swagger';
import { CommonEntityInterface } from '../interfaces/common.entity.interface';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonEntity implements CommonEntityInterface {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the entity was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt!: Date;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the entity was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt!: Date;

  @Column({ default: true })
  @ApiProperty({
    description: 'Indicates if the entity is active',
    example: true,
  })
  isActive?: boolean;
}
