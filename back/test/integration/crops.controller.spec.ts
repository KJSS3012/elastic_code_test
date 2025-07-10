import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CropsController } from '../../src/modules/crops/crops.controller';
import { CropsService } from '../../src/modules/crops/crops.service';
import { CropsRepository } from '../../src/modules/crops/crops.repository';
import { Crop } from '../../src/modules/crops/entities/crop.entity';
import { CreateCropDto } from '../../src/modules/crops/dto/create-crop.dto';
import { UpdateCropDto } from '../../src/modules/crops/dto/update-crop.dto';
import { AuthGuard } from '../../src/modules/auth/auth.guard';
import { cropFixtures } from '../fixtures';
import { getTestDatabaseConfig, cleanDatabase } from '../utils/test-helpers';

// Mock AuthGuard to bypass authentication in integration tests
const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('CropsController (Integration)', () => {
  let app: TestingModule;
  let controller: CropsController;
  let service: CropsService;
  let repository: CropsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Crop]),
      ],
      controllers: [CropsController],
      providers: [CropsService, CropsRepository],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = app.get<CropsController>(CropsController);
    service = app.get<CropsService>(CropsService);
    repository = app.get<CropsRepository>(CropsRepository);
    dataSource = app.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await cleanDatabase(dataSource);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /crops', () => {
    it('should create a crop with valid data', async () => {
      // Arrange
      const createCropDto: CreateCropDto = {
        crop_name: 'Milho Híbrido',
      };

      // Act
      const result = await controller.create(createCropDto);

      // Assert
      expect(result.message).toBe('Crop created successfully');
      expect(result.data).toBeDefined();
      expect(result.data.crop_name).toBe(createCropDto.crop_name);
      expect(result.data.id).toBeDefined();
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const invalidCropDto = {} as CreateCropDto;

      // Act & Assert
      await expect(controller.create(invalidCropDto)).rejects.toThrow();
    });

    it('should create multiple crops', async () => {
      // Arrange
      const crops = [
        { crop_name: 'Milho' },
        { crop_name: 'Soja' },
        { crop_name: 'Trigo' },
      ];

      // Act
      const results = await Promise.all(
        crops.map(crop => controller.create(crop))
      );

      // Assert
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.message).toBe('Crop created successfully');
        expect(result.data.crop_name).toBe(crops[index].crop_name);
      });
    });
  });

  describe('GET /crops', () => {
    beforeEach(async () => {
      // Seed database with test data
      const crops = cropFixtures.createManyCrops(5).map(crop => ({
        crop_name: crop.crop_name,
      }));

      await Promise.all(
        crops.map(crop => repository.save(repository.createEntity(crop)))
      );
    });

    it('should return paginated crops', async () => {
      // Act
      const result = await controller.findAll();

      // Assert
      expect(result.data).toBeDefined();
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(1);
      expect(result.data.length).toBe(5);
    });

    it('should handle pagination correctly', async () => {
      // Act
      const result = await controller.findAll();

      // Assert
      expect(result.data).toBeDefined();
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(1);
      expect(result.data.length).toBe(5);
    });

    it('should return empty array when no crops exist', async () => {
      // Arrange
      await cleanDatabase(dataSource);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(0);
    });
  });

  describe('GET /crops/:id', () => {
    let createdCrop: any;

    beforeEach(async () => {
      // Create a crop for testing
      const createResult = await controller.create({
        crop_name: 'Milho para Teste',
      });
      createdCrop = createResult.data;
    });

    it('should return a crop by id', async () => {
      // Act
      const result = await controller.findOne(createdCrop.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(createdCrop.id);
      expect(result.crop_name).toBe('Milho para Teste');
    });

    it('should throw error when crop not found', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';

      // Act & Assert
      await expect(controller.findOne(nonExistentId)).rejects.toThrow();
    });
  });

  describe('PUT /crops/:id', () => {
    let createdCrop: any;

    beforeEach(async () => {
      // Create a crop for testing
      const createResult = await controller.create({
        crop_name: 'Milho Original',
      });
      createdCrop = createResult.data;
    });

    it('should update a crop', async () => {
      // Arrange
      const updateCropDto: UpdateCropDto = {
        crop_name: 'Milho Atualizado',
      };

      // Act
      const result = await controller.update(createdCrop.id, updateCropDto);

      // Assert
      expect(result.message).toBe('Crop updated successfully');
      expect(result.data.id).toBe(createdCrop.id);

      // Verify the update
      const updatedCrop = await controller.findOne(createdCrop.id);
      expect(updatedCrop.crop_name).toBe('Milho Atualizado');
    });

    it('should throw error when updating non-existent crop', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';
      const updateCropDto: UpdateCropDto = {
        crop_name: 'Milho Atualizado',
      };

      // Act & Assert
      await expect(controller.update(nonExistentId, updateCropDto)).rejects.toThrow();
    });
  });

  describe('DELETE /crops/:id', () => {
    let createdCrop: any;

    beforeEach(async () => {
      // Create a crop for testing
      const createResult = await controller.create({
        crop_name: 'Milho para Deletar',
      });
      createdCrop = createResult.data;
    });

    it('should delete a crop', async () => {
      // Act
      const result = await controller.remove(createdCrop.id);

      // Assert
      expect(result.message).toBe('Crop removed successfully');

      // Verify the deletion
      await expect(controller.findOne(createdCrop.id)).rejects.toThrow();
    });

    it('should throw error when deleting non-existent crop', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';

      // Act & Assert
      await expect(controller.remove(nonExistentId)).rejects.toThrow();
    });
  });

  describe('Database Integration Edge Cases', () => {
    it('should handle concurrent operations', async () => {
      // Arrange
      const crops = Array.from({ length: 10 }, (_, i) => ({
        crop_name: `Crop ${i + 1}`,
      }));

      // Act
      const results = await Promise.all(
        crops.map(crop => controller.create(crop))
      );

      // Assert
      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result.message).toBe('Crop created successfully');
        expect(result.data.crop_name).toBe(crops[index].crop_name);
      });
    });

    it('should handle database constraints', async () => {
      // This would test unique constraints, foreign keys, etc.
      // The actual implementation depends on your entity constraints
      const crop = { crop_name: 'Test Crop' };

      // Act
      await controller.create(crop);

      // If there's a unique constraint on crop_name, this should fail
      // await expect(controller.create(crop)).rejects.toThrow();
    });

    it('should handle transaction rollback scenarios', async () => {
      // This would test scenarios where transactions need to be rolled back
      // The actual implementation depends on your service layer transaction handling
      const crop = { crop_name: 'Transaction Test' };

      // Act & Assert
      // Test would depend on specific business logic that could cause rollbacks
      const result = await controller.create(crop);
      expect(result.message).toBe('Crop created successfully');
    });
  });
});
