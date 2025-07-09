import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';
import { Farmer } from '../farmers/entities/farmer.entity';
import { Property } from '../properties/entities/property.entity';
import { Crop } from '../crops/entities/crop.entity';
import { Harvest } from '../harvests/entities/harvest.entity';
import { PropertyCropHarvest } from '../property-crop-harvest/entities/property-crop-harvest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Farmer,
      Property,
      Crop,
      Harvest,
      PropertyCropHarvest
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService]
})
export class DashboardModule { }
