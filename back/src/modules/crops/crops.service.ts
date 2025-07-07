import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropsRepository } from './crops.repository';

@Injectable()
export class CropsService {
  constructor(private readonly cropsRepository: CropsRepository) { }

  create(createCropDto: CreateCropDto) {
    try {
      const crop = this.cropsRepository.createEntity(createCropDto);
      this.cropsRepository.save(crop);

      return {
        message: 'Crop created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating crop: ' + error.message);
    }
  }

  async findAll(page = 1, limit = 10) {
    const result = await this.cropsRepository.findAll(page, limit)
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    }
  }

  async findOne(id: string) {
    const crop = await this.cropsRepository.findOneById(id);
    if (!crop) {
      throw new BadRequestException('Crop not found');
    }
    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto) {
    const crop = await this.cropsRepository.findOneById(id);
    if (!crop) {
      throw new BadRequestException('Crop not found');
    }
    Object.assign(crop, updateCropDto);
    await this.cropsRepository.save(crop);
    return {
      message: 'Crop updated successfully',
      data: {
        id: crop.id,
      },
    };
  }

  async remove(id: string) {
    const crop = await this.cropsRepository.findOneById(id);
    if (!crop) {
      throw new BadRequestException('Crop not found');
    }
    await this.cropsRepository.remove(id);
    return {
      message: 'Crop removed successfully',
    };
  }
}
