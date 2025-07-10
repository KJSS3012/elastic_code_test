import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

describe('PropertiesController', () => {
  let controller: PropertiesController;

  const mockPropertiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addHarvestCrop: jest.fn(),
    createHarvest: jest.fn(),
  };

  const mockUser = {
    id: '1',
    role: 'farmer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const createDto = {
        farmer_id: '550e8400-e29b-41d4-a716-446655440000',
        farm_name: 'Test Farm',
        city: 'Test City',
        state: 'Test State',
        total_area_ha: 100.5,
        arable_area_ha: 75.0,
        vegetable_area_ha: 25.5
      };
      const result = { message: 'Property created successfully', data: { id: '1', farm_name: 'Test Farm' } };

      mockPropertiesService.create.mockResolvedValue(result);

      expect(await controller.create(createDto, mockUser)).toBe(result);
      expect(mockPropertiesService.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      const result = { data: [], total: 0, page: 1, lastPage: 0 };

      mockPropertiesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(mockUser)).toBe(result);
      expect(mockPropertiesService.findAll).toHaveBeenCalledWith(mockUser, 1, 10);
    });

    it('should return all properties with custom pagination', async () => {
      const result = { data: [], total: 0, page: 2, lastPage: 0 };

      mockPropertiesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(mockUser, '2', '20')).toBe(result);
      expect(mockPropertiesService.findAll).toHaveBeenCalledWith(mockUser, 2, 20);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      const result = { id: '1', farm_name: 'Test Property' };

      mockPropertiesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1', mockUser)).toBe(result);
      expect(mockPropertiesService.findOne).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      const updateDto = { farm_name: 'Updated Farm' };
      const result = { message: 'Property updated successfully', data: { id: '1' } };

      mockPropertiesService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto, mockUser)).toBe(result);
      expect(mockPropertiesService.update).toHaveBeenCalledWith('1', updateDto, mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a property', async () => {
      const result = { message: 'Property removed successfully' };

      mockPropertiesService.remove.mockResolvedValue(result);

      expect(await controller.remove('1', mockUser)).toBe(result);
      expect(mockPropertiesService.remove).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('addHarvestCrop', () => {
    it('should add harvest crop to property', async () => {
      const data = { cropId: '1', harvestId: '1' };
      const result = { message: 'Harvest crop added successfully' };

      mockPropertiesService.addHarvestCrop.mockResolvedValue(result);

      expect(await controller.addHarvestCrop('1', data, mockUser)).toBe(result);
      expect(mockPropertiesService.addHarvestCrop).toHaveBeenCalledWith('1', data, mockUser);
    });
  });

  describe('createHarvest', () => {
    it('should create harvest for property', async () => {
      const data = { year: 2024, season: 'spring' };
      const result = { message: 'Harvest created successfully', data: { id: '1' } };

      mockPropertiesService.createHarvest.mockResolvedValue(result);

      expect(await controller.createHarvest('1', data, mockUser)).toBe(result);
      expect(mockPropertiesService.createHarvest).toHaveBeenCalledWith('1', data, mockUser);
    });
  });
});
