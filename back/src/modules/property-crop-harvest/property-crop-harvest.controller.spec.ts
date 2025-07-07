import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCropHarvestController } from './property-crop-harvest.controller';
import { PropertyCropHarvestService } from './property-crop-harvest.service';

describe('PropertyCropHarvestController', () => {
  let controller: PropertyCropHarvestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyCropHarvestController],
      providers: [PropertyCropHarvestService],
    }).compile();

    controller = module.get<PropertyCropHarvestController>(PropertyCropHarvestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
