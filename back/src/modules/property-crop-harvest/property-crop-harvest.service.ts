import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePropertyCropHarvestDto } from './dto/create-property-crop-harvest.dto';
import { UpdatePropertyCropHarvestDto } from './dto/update-property-crop-harvest.dto';
import { PropertyCropHarvestRepository } from './property-crop-harvest.repository';

@Injectable()
export class PropertyCropHarvestService {
  constructor(private readonly propertyCropHarvestRepository: PropertyCropHarvestRepository) { }

  async create(createPropertyCropHarvestDto: CreatePropertyCropHarvestDto) {
    try {
      const propertyCropHarvest = this.propertyCropHarvestRepository.createEntity(createPropertyCropHarvestDto);
      return await this.propertyCropHarvestRepository.save(propertyCropHarvest);

    } catch (error) {
      throw new BadRequestException(
        'Error creating property crop harvest: ' + error.message,
      );
    }
  }

  async findAll(page = 1, limit = 10) {
    const result = await this.propertyCropHarvestRepository.findAll(page, limit);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    };
  }

  findOne(id: string) {
    const propertyCropHarvest = this.propertyCropHarvestRepository.findOneById(id);
    if (!propertyCropHarvest) {
      throw new BadRequestException('Property not found');
    }
    return propertyCropHarvest;
  }

  async update(id: string, updatePropertyCropHarvestDto: UpdatePropertyCropHarvestDto) {
    const propertyCropHarvest = await this.propertyCropHarvestRepository.findOneById(id);
    if (!propertyCropHarvest) {
      throw new BadRequestException('Property not found');
    }
    Object.assign(propertyCropHarvest, updatePropertyCropHarvestDto);
    await this.propertyCropHarvestRepository.update(propertyCropHarvest);
    return {
      message: 'Property updated successfully',
    };
  }

  async remove(id: string) {
    const propertyCropHarvest = await this.propertyCropHarvestRepository.findOneById(id);
    if (!propertyCropHarvest) {
      throw new BadRequestException('Property not found');
    }
    await this.propertyCropHarvestRepository.remove(id);
    return {
      message: 'Property deleted successfully',
    };
  }

  async removeByCropId(cropId: string) {
    return await this.propertyCropHarvestRepository.removeByCropId(cropId);
  }

  async removeByHarvestId(harvestId: string) {
    return await this.propertyCropHarvestRepository.removeByHarvestId(harvestId);
  }

  async removeByPropertyId(propertyId: string) {
    return await this.propertyCropHarvestRepository.removeByPropertyId(propertyId);
  }
}
