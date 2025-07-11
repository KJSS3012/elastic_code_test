import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCropHarvestService } from './property-crop-harvest.service';
import { PropertyCropHarvestRepository } from './property-crop-harvest.repository';

describe('PropertyCropHarvestService', () => {
  let service: PropertyCropHarvestService;

  const mockPropertyCropHarvestRepository = {
    createEntity: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyCropHarvestService,
        {
          provide: PropertyCropHarvestRepository,
          useValue: mockPropertyCropHarvestRepository,
        },
      ],
    }).compile();

    service = module.get<PropertyCropHarvestService>(PropertyCropHarvestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
