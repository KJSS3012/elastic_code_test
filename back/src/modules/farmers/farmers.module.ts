import { Module } from '@nestjs/common';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { FarmersRepository } from './farmers.repository';
import { Property } from '../properties/entities/property.entity';
import { PropertyCropHarvest } from '../property-crop-harvest/entities/property-crop-harvest.entity';
import { Harvest } from '../harvests/entities/harvest.entity';
import { PropertiesRepository } from '../properties/properties.repository';
import { PropertyCropHarvestRepository } from '../property-crop-harvest/property-crop-harvest.repository';
import { HavestRepository } from '../harvests/harvests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, Property, PropertyCropHarvest, Harvest])],
  controllers: [FarmersController],
  providers: [FarmersService, FarmersRepository, PropertiesRepository, PropertyCropHarvestRepository, HavestRepository],
  exports: [FarmersService, FarmersRepository],
})
export class FarmersModule { }
