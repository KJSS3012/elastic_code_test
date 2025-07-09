import { Module, forwardRef } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertiesRepository } from './properties.repository';
import { PropertyCropHarvestModule } from '../property-crop-harvest/property-crop-harvest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    forwardRef(() => PropertyCropHarvestModule)
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesRepository],
  exports: [PropertiesService, PropertiesRepository],
})
export class PropertiesModule { }
