import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCropHarvestController } from './property-crop-harvest.controller';
import { PropertyCropHarvestService } from './property-crop-harvest.service';

describe('PropertyCropHarvestController', () => {
  let controller: PropertyCropHarvestController;

  const mockPropertyCropHarvestService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyCropHarvestController],
      providers: [
        {
          provide: PropertyCropHarvestService,
          useValue: mockPropertyCropHarvestService,
        },
      ],
    }).compile();

    controller = module.get<PropertyCropHarvestController>(PropertyCropHarvestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a property-crop-harvest relationship', async () => {
      const createDto = {
        property_id: '123e4567-e89b-12d3-a456-426614174000',
        crop_id: '123e4567-e89b-12d3-a456-426614174002',
        harvest_id: '123e4567-e89b-12d3-a456-426614174001',
        planted_area_ha: 10.5,
        planting_date: new Date('2023-03-01'),
        harvest_date: new Date('2023-09-01')
      };
      const result = { message: 'Property crop harvest created successfully', data: { id: '1' } };

      mockPropertyCropHarvestService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockPropertyCropHarvestService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all property-crop-harvest relationships', async () => {
      const result = { data: [], total: 0 };

      mockPropertyCropHarvestService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockPropertyCropHarvestService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a property-crop-harvest relationship by id', async () => {
      const result = { id: '1', property_id: '1', crop_id: '1', harvest_id: '1' };

      mockPropertyCropHarvestService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockPropertyCropHarvestService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a property-crop-harvest relationship', async () => {
      const updateDto = { planted_area_ha: 12.0 };
      const result = { message: 'Property crop harvest updated successfully', data: { id: '1' } };

      mockPropertyCropHarvestService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
      expect(mockPropertyCropHarvestService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a property-crop-harvest relationship', async () => {
      const result = { message: 'Property crop harvest removed successfully' };

      mockPropertyCropHarvestService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(mockPropertyCropHarvestService.remove).toHaveBeenCalledWith('1');
    });
  });
});
