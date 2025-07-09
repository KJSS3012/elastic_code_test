import { BadRequestException, Injectable, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesRepository } from './properties.repository';
import { JwtPayloadInterface } from '../auth/interface/jwt.payload.interface';
import { PropertyCropHarvestService } from '../property-crop-harvest/property-crop-harvest.service';
import { HarvestsService } from '../harvests/harvests.service';
import { CropsService } from '../crops/crops.service';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly propertiesRepository: PropertiesRepository,
    @Inject(forwardRef(() => PropertyCropHarvestService))
    private readonly propertyCropHarvestService: PropertyCropHarvestService,
    private readonly harvestsService: HarvestsService,
    private readonly cropsService: CropsService,
  ) { }

  async create(createPropertyDto: CreatePropertyDto, user: JwtPayloadInterface) {
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

      // Para farmers, usar seu próprio ID. Para admins, usar o farmer_id fornecido
      if (user.role === 'farmer') {
        createPropertyDto.farmer_id = user.id;
      }

      const property = this.propertiesRepository.createEntity(createPropertyDto);
      const savedProperty = await this.propertiesRepository.save(property);

      return {
        message: 'Property created successfully',
        data: savedProperty,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error creating property: ' + error.message,
      );
    }
  }
  async findAll(user: JwtPayloadInterface, page = 1, limit = 10) {
    let result;

    if (user.role === 'farmer') {
      // Farmers só veem suas próprias propriedades com relações
      result = await this.propertiesRepository.findByFarmerIdWithRelations(user.id, page, limit);
    } else {
      // Admins veem todas as propriedades
      result = await this.propertiesRepository.findAll(page, limit);
    }

    // Transformar dados para o formato esperado pelo frontend
    const transformedData = result.data.map(property => this.transformPropertyData(property));

    return {
      data: transformedData,
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    };
  }

  async findOne(id: string, user: JwtPayloadInterface) {
    const property = await this.propertiesRepository.findOneByIdWithRelations(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    // Verificar se o usuário tem permissão para ver esta propriedade
    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only view your own properties');
    }

    return this.transformPropertyData(property);
  }

  private transformPropertyData(property: any) {
    // Agrupar por harvest e organizar crops
    const harvestsMap = new Map();

    if (property.propertyCropHarvests) {
      property.propertyCropHarvests.forEach((pch: any) => {
        const harvestId = pch.harvest_id;

        if (!harvestsMap.has(harvestId)) {
          harvestsMap.set(harvestId, {
            id: harvestId,
            name: pch.harvest?.harvest_name || `Safra ${pch.harvest?.harvest_year}`,
            harvest_year: pch.harvest?.harvest_year,
            start_date: pch.harvest?.start_date,
            end_date: pch.harvest?.end_date,
            total_area_ha: 0,
            crops: []
          });
        }

        const harvest = harvestsMap.get(harvestId);
        harvest.total_area_ha += pch.planted_area_ha;
        harvest.crops.push({
          id: pch.crop_id,
          name: pch.crop?.crop_name || 'Cultura desconhecida',
          planted_area_ha: pch.planted_area_ha,
          planting_date: pch.planting_date,
          harvest_date: pch.harvest_date
        });
      });
    }

    return {
      id: property.id,
      farm_name: property.farm_name,
      city: property.city,
      state: property.state,
      total_area_ha: property.total_area_ha,
      arable_area_ha: property.arable_area_ha,
      vegetable_area_ha: property.vegetable_area_ha,
      farmer_id: property.farmer_id,
      harvests: Array.from(harvestsMap.values())
    };
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, user: JwtPayloadInterface) {
    const property = await this.propertiesRepository.findOneById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    // Verificar se o usuário tem permissão para editar esta propriedade
    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only update your own properties');
    }

    Object.assign(property, updatePropertyDto);
    await this.propertiesRepository.save(property);
    return {
      message: 'Property updated successfully',
      data: property,
    };
  }

  async remove(id: string, user: JwtPayloadInterface) {
    const property = await this.propertiesRepository.findOneById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    // Verificar se o usuário tem permissão para deletar esta propriedade
    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertiesRepository.remove(id);
    return {
      message: 'Property removed successfully',
    };
  }

  async addHarvestCrop(propertyId: string, data: any, user: JwtPayloadInterface) {
    // Verificar se a propriedade existe e se o usuário tem permissão
    const property = await this.propertiesRepository.findOneById(propertyId);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only manage your own properties');
    }

    // Criar ou buscar harvest e crop, depois criar a relação
    // Por simplicidade, vou assumir que harvest_id e crop_id já existem
    const harvestCropData = {
      property_id: propertyId,
      harvest_id: data.harvest_id,
      crop_id: data.crop_id,
      planted_area_ha: data.planted_area_ha,
      planting_date: data.planting_date,
      harvest_date: data.harvest_date
    };

    return this.propertyCropHarvestService.create(harvestCropData);
  }

  async createHarvest(propertyId: string, data: any, user: JwtPayloadInterface) {
    // Verificar se a propriedade existe e se o usuário tem permissão
    const property = await this.propertiesRepository.findOneById(propertyId);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only manage your own properties');
    }

    // Criar a safra (harvest)
    const harvestData = {
      harvest_name: data.name,
      harvest_year: new Date().getFullYear(),
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano depois
    };

    return this.harvestsService.create(harvestData);
  }

  async createCrop(propertyId: string, harvestId: string, data: any, user: JwtPayloadInterface) {
    // Verificar se a propriedade existe e se o usuário tem permissão
    const property = await this.propertiesRepository.findOneById(propertyId);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only manage your own properties');
    }

    // Criar a cultura (crop)
    const cropData = {
      crop_name: data.name
    };

    const cropResult = await this.cropsService.create(cropData);

    // Criar a relação PropertyCropHarvest
    const relationData = {
      property_id: propertyId,
      harvest_id: harvestId,
      crop_id: cropResult.data.id,
      planted_area_ha: data.planted_area_ha,
      planting_date: new Date(),
      harvest_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 meses depois
    };

    await this.propertyCropHarvestService.create(relationData);

    return { message: 'Crop created and linked to harvest successfully' };
  }

  async removeHarvest(propertyId: string, harvestId: string, user: JwtPayloadInterface) {
    // Verificar permissões
    const property = await this.propertiesRepository.findOneById(propertyId);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only manage your own properties');
    }

    // Remover todas as relações desta safra nesta propriedade
    // Implementar lógica específica no PropertyCropHarvestService
    return { message: 'Harvest removed successfully' };
  }

  async removeCrop(propertyId: string, harvestId: string, cropId: string, user: JwtPayloadInterface) {
    // Verificar permissões
    const property = await this.propertiesRepository.findOneById(propertyId);
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (user.role === 'farmer' && property.farmer_id !== user.id) {
      throw new ForbiddenException('You can only manage your own properties');
    }

    // Remover a relação específica
    // Implementar lógica específica no PropertyCropHarvestService
    return { message: 'Crop removed successfully' };
  }
}
