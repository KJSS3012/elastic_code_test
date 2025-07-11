import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropsRepository } from './crops.repository';
import { LoggerService } from '../../shared/logging/logger.service';
import { LogOperation } from '../../shared/logging/log-operation.decorator';

@Injectable()
export class CropsService {
  constructor(
    private readonly cropsRepository: CropsRepository,
    private readonly logger: LoggerService,
  ) { }

  @LogOperation({
    operation: 'create_crop',
    module: 'crops',
    logInput: true,
    logOutput: true
  })
  async create(createCropDto: CreateCropDto) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Starting crop creation', {
        correlationId,
        operation: 'create_crop',
        module: 'crops',
        metadata: { input: createCropDto }
      });

      const crop = this.cropsRepository.createEntity(createCropDto);
      const savedCrop = await this.cropsRepository.save(crop);

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_crop', true, {
        correlationId,
        duration,
        module: 'crops',
        metadata: { cropId: savedCrop.id, cropName: savedCrop.crop_name }
      });

      return {
        message: 'Crop created successfully',
        data: savedCrop,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_crop', false, {
        correlationId,
        duration,
        module: 'crops',
        error: error.message,
        metadata: { input: createCropDto }
      });

      throw new BadRequestException('Error creating crop: ' + error.message);
    }
  }

  @LogOperation({
    operation: 'list_crops',
    module: 'crops',
    logOutput: false  // Não logar dados de saída para listas grandes
  })
  async findAll(page = 1, limit = 10) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Fetching crops list', {
        correlationId,
        operation: 'list_crops',
        module: 'crops',
        metadata: { page, limit }
      });

      const result = await this.cropsRepository.findAll(page, limit);

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('list_crops', true, {
        correlationId,
        duration,
        module: 'crops',
        metadata: {
          page,
          limit,
          totalRecords: result.total,
          recordsReturned: result.data.length
        }
      });

      return {
        data: result.data,
        total: result.total,
        page: result.page,
        lastPage: Math.ceil(result.total / result.limit),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('list_crops', false, {
        correlationId,
        duration,
        module: 'crops',
        error: error.message,
        metadata: { page, limit }
      });
      throw error;
    }
  }

  @LogOperation({
    operation: 'find_crop',
    module: 'crops',
    logInput: true,
    logOutput: true
  })
  async findOne(id: string) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Finding crop by ID', {
        correlationId,
        operation: 'find_crop',
        module: 'crops',
        metadata: { cropId: id }
      });

      const crop = await this.cropsRepository.findOneById(id);

      if (!crop) {
        this.logger.warn('Crop not found', {
          correlationId,
          operation: 'find_crop',
          module: 'crops',
          metadata: { cropId: id }
        });
        throw new BadRequestException('Crop not found');
      }

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('find_crop', true, {
        correlationId,
        duration,
        module: 'crops',
        metadata: { cropId: id, cropName: crop.crop_name }
      });

      return crop;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('find_crop', false, {
        correlationId,
        duration,
        module: 'crops',
        error: error.message,
        metadata: { cropId: id }
      });
      throw error;
    }
  }

  @LogOperation({
    operation: 'update_crop',
    module: 'crops',
    logInput: true,
    logOutput: true
  })
  async update(id: string, updateCropDto: UpdateCropDto) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Starting crop update', {
        correlationId,
        operation: 'update_crop',
        module: 'crops',
        metadata: { cropId: id, updates: updateCropDto }
      });

      const crop = await this.cropsRepository.findOneById(id);
      if (!crop) {
        this.logger.warn('Crop not found for update', {
          correlationId,
          operation: 'update_crop',
          module: 'crops',
          metadata: { cropId: id }
        });
        throw new BadRequestException('Crop not found');
      }

      Object.assign(crop, updateCropDto);
      await this.cropsRepository.save(crop);

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('update_crop', true, {
        correlationId,
        duration,
        module: 'crops',
        metadata: { cropId: id, updates: updateCropDto }
      });

      return {
        message: 'Crop updated successfully',
        data: {
          id: crop.id,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('update_crop', false, {
        correlationId,
        duration,
        module: 'crops',
        error: error.message,
        metadata: { cropId: id, updates: updateCropDto }
      });
      throw error;
    }
  }

  @LogOperation({
    operation: 'delete_crop',
    module: 'crops',
    logInput: true
  })
  async remove(id: string) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Starting crop deletion', {
        correlationId,
        operation: 'delete_crop',
        module: 'crops',
        metadata: { cropId: id }
      });

      const crop = await this.cropsRepository.findOneById(id);
      if (!crop) {
        this.logger.warn('Crop not found for deletion', {
          correlationId,
          operation: 'delete_crop',
          module: 'crops',
          metadata: { cropId: id }
        });
        throw new BadRequestException('Crop not found');
      }

      await this.cropsRepository.remove(id);

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('delete_crop', true, {
        correlationId,
        duration,
        module: 'crops',
        metadata: { cropId: id, cropName: crop.crop_name }
      });

      return {
        message: 'Crop removed successfully',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('delete_crop', false, {
        correlationId,
        duration,
        module: 'crops',
        error: error.message,
        metadata: { cropId: id }
      });
      throw error;
    }
  }
}
