import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCropHarvestService } from './property-crop-harvest.service';

describe('PropertyCropHarvestService', () => {
  let service: PropertyCropHarvestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyCropHarvestService],
    }).compile();

    service = module.get<PropertyCropHarvestService>(PropertyCropHarvestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
