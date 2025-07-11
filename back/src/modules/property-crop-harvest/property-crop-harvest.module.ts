import { Module } from '@nestjs/common';
import { PropertyCropHarvestService } from './property-crop-harvest.service';
import { PropertyCropHarvestController } from './property-crop-harvest.controller';
import { PropertyCropHarvestRepository } from './property-crop-harvest.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCropHarvest } from './entities/property-crop-harvest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyCropHarvest])],
  controllers: [PropertyCropHarvestController],
  providers: [PropertyCropHarvestService, PropertyCropHarvestRepository],
  exports: [PropertyCropHarvestService, PropertyCropHarvestRepository],
})
export class PropertyCropHarvestModule { }
