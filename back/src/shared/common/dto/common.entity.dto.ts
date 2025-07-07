import { ApiProperty } from '@nestjs/swagger';

export class CommonEntityDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    title: 'Id',
    description: 'The primary key of the resource.',
  })
  id!: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    title: 'Created At',
    description: 'The date and time at which the resource was created.',
  })
  createdAt!: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    title: 'Updated At',
    description: 'The date and time at which the resource was last updated.',
  })
  updatedAt!: Date;
}
