import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  const mockCropsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        {
          provide: CropsService,
          useValue: mockCropsService,
        },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const createCropDto = { crop_name: 'Milho' };
      const result = { message: 'Crop created successfully', data: { id: '1', crop_name: 'Milho' } };

      mockCropsService.create.mockResolvedValue(result);

      expect(await controller.create(createCropDto)).toBe(result);
      expect(mockCropsService.create).toHaveBeenCalledWith(createCropDto);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const result = { data: [], total: 0, page: 1, lastPage: 0 };

      mockCropsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockCropsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      const result = { id: '1', crop_name: 'Milho' };

      mockCropsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockCropsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a crop', async () => {
      const updateCropDto = { crop_name: 'Milho Atualizado' };
      const result = { message: 'Crop updated successfully', data: { id: '1' } };

      mockCropsService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCropDto)).toBe(result);
      expect(mockCropsService.update).toHaveBeenCalledWith('1', updateCropDto);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const result = { message: 'Crop removed successfully' };

      mockCropsService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(mockCropsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
