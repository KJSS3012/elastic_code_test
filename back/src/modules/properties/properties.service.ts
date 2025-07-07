import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesRepository } from './properties.repository';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) { }

  create(createPropertyDto: CreatePropertyDto) {
    try {
      const {
        total_area_ha,
        arable_area_ha,
        vegetable_area_ha,
      } = createPropertyDto;

      const sumAreas = arable_area_ha + vegetable_area_ha;

      if (sumAreas > total_area_ha) {
        throw new BadRequestException(
          `The sum of arable area (${arable_area_ha} ha) and vegetable area (${vegetable_area_ha} ha) cannot be greater than the total area (${total_area_ha} ha).`,
        );
      }

      const property = this.propertiesRepository.createEntity(createPropertyDto);
      this.propertiesRepository.save(property);

      return {
        message: 'Property created successfully',
        data: {
          id: property.id,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Error creating property: ' + error.message,
      );
    }
  }

  async findAll(page = 1, limit = 10) {
    const result = await this.propertiesRepository.findAll(page, limit);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    };
  }

  findOne(id: string) {
    const property = this.propertiesRepository.findOneById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.propertiesRepository.findOneById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    Object.assign(property, updatePropertyDto);
    await this.propertiesRepository.save(property);
    return {
      message: 'Property updated successfully',
      data: {
        id: property.id,
      },
    };
  }

  async remove(id: string) {
    const property = this.propertiesRepository.findOneById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    await this.propertiesRepository.remove(id);
    return {
      message: 'Property removed successfully',
    };
  }
}
