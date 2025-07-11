import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { PropertiesRepository } from './properties.repository';
import { PropertyCropHarvestService } from '../property-crop-harvest/property-crop-harvest.service';
import { HarvestsService } from '../harvests/harvests.service';
import { CropsService } from '../crops/crops.service';
import { LoggerService } from '../../shared/logging/logger.service';

describe('PropertiesService', () => {
  let service: PropertiesService;

  const mockPropertiesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPropertyCropHarvestService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockHarvestsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCropsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    generateCorrelationId: jest.fn(() => 'test-correlation-id'),
    logBusinessOperation: jest.fn(),
    logDatabaseOperation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PropertiesRepository,
          useValue: mockPropertiesRepository,
        },
        {
          provide: PropertyCropHarvestService,
          useValue: mockPropertyCropHarvestService,
        },
        {
          provide: HarvestsService,
          useValue: mockHarvestsService,
        },
        {
          provide: CropsService,
          useValue: mockCropsService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
