import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CropsService } from './crops.service';
import { CropsRepository } from './crops.repository';
import { LoggerService } from '../../shared/logging/logger.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { cropFixtures } from '../../../test/fixtures';

describe('CropsService', () => {
  let service: CropsService;
  let repository: jest.Mocked<CropsRepository>;

  const mockRepository = {
    createEntity: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
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
        CropsService,
        {
          provide: CropsRepository,
          useValue: mockRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    repository = module.get<CropsRepository>(CropsRepository) as jest.Mocked<CropsRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a crop successfully', async () => {
      // Arrange
      const createCropDto: CreateCropDto = {
        crop_name: 'Milho',
      };

      const mockCrop = cropFixtures.validCrop;
      repository.createEntity.mockReturnValue(mockCrop);
      repository.save.mockResolvedValue(mockCrop);

      // Act
      const result = await service.create(createCropDto);

      // Assert
      expect(repository.createEntity).toHaveBeenCalledWith(createCropDto);
      expect(repository.save).toHaveBeenCalledWith(mockCrop);
      expect(result).toEqual({
        message: 'Crop created successfully',
        data: mockCrop,
      });
    });

    it('should throw BadRequestException when save fails', async () => {
      // Arrange
      const createCropDto: CreateCropDto = {
        crop_name: 'Milho',
      };

      const mockCrop = cropFixtures.validCrop;
      repository.createEntity.mockReturnValue(mockCrop);
      repository.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.create(createCropDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createCropDto)).rejects.toThrow('Error creating crop: Database error');
    });
  });

  describe('findAll', () => {
    it('should return paginated crops', async () => {
      // Arrange
      const mockPaginatedResult = {
        data: [cropFixtures.validCrop],
        total: 1,
        page: 1,
        limit: 10,
      };
      repository.findAll.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        data: mockPaginatedResult.data,
        total: mockPaginatedResult.total,
        page: mockPaginatedResult.page,
        lastPage: Math.ceil(mockPaginatedResult.total / mockPaginatedResult.limit),
      });
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      // Arrange
      const cropId = 'valid-crop-id';
      const mockCrop = cropFixtures.validCrop;
      repository.findOneById.mockResolvedValue(mockCrop);

      // Act
      const result = await service.findOne(cropId);

      // Assert
      expect(repository.findOneById).toHaveBeenCalledWith(cropId);
      expect(result).toEqual(mockCrop);
    });

    it('should throw BadRequestException when crop not found', async () => {
      // Arrange
      const cropId = 'non-existent-id';
      repository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(cropId)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(cropId)).rejects.toThrow('Crop not found');
    });
  });

  describe('update', () => {
    it('should update a crop successfully', async () => {
      // Arrange
      const cropId = 'valid-crop-id';
      const updateCropDto: UpdateCropDto = {
        crop_name: 'Milho Atualizado',
      };
      const mockCrop = { ...cropFixtures.validCrop };
      repository.findOneById.mockResolvedValue(mockCrop);
      repository.save.mockResolvedValue({ ...mockCrop, ...updateCropDto });

      // Act
      const result = await service.update(cropId, updateCropDto);

      // Assert
      expect(repository.findOneById).toHaveBeenCalledWith(cropId);
      expect(repository.save).toHaveBeenCalledWith({ ...mockCrop, ...updateCropDto });
      expect(result).toEqual({
        message: 'Crop updated successfully',
        data: {
          id: mockCrop.id,
        },
      });
    });

    it('should throw BadRequestException when crop not found', async () => {
      // Arrange
      const cropId = 'non-existent-id';
      const updateCropDto: UpdateCropDto = { crop_name: 'Updated Name' };
      repository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(cropId, updateCropDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(cropId, updateCropDto)).rejects.toThrow('Crop not found');
    });
  });

  describe('remove', () => {
    it('should remove a crop successfully', async () => {
      // Arrange
      const cropId = 'valid-crop-id';
      const mockCrop = cropFixtures.validCrop;
      repository.findOneById.mockResolvedValue(mockCrop);
      repository.remove.mockResolvedValue(undefined);

      // Act
      const result = await service.remove(cropId);

      // Assert
      expect(repository.findOneById).toHaveBeenCalledWith(cropId);
      expect(repository.remove).toHaveBeenCalledWith(cropId);
      expect(result).toEqual({
        message: 'Crop removed successfully',
      });
    });

    it('should throw BadRequestException when crop not found', async () => {
      // Arrange
      const cropId = 'non-existent-id';
      repository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(cropId)).rejects.toThrow(BadRequestException);
      await expect(service.remove(cropId)).rejects.toThrow('Crop not found');
    });
  });
});
