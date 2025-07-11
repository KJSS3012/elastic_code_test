import { BadRequestException, Injectable, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesRepository } from './properties.repository';
import { JwtPayloadInterface } from '../auth/interface/jwt.payload.interface';
import { PropertyCropHarvestService } from '../property-crop-harvest/property-crop-harvest.service';
import { HarvestsService } from '../harvests/harvests.service';
import { CropsService } from '../crops/crops.service';
import { LoggerService } from '../../shared/logging/logger.service';
import { LogOperation } from '../../shared/logging/log-operation.decorator';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly propertiesRepository: PropertiesRepository,
    @Inject(forwardRef(() => PropertyCropHarvestService))
    private readonly propertyCropHarvestService: PropertyCropHarvestService,
    private readonly harvestsService: HarvestsService,
    private readonly cropsService: CropsService,
    private readonly logger: LoggerService,
  ) { }

  @LogOperation({
    operation: 'create_property',
    module: 'properties',
    logInput: true,
    logOutput: true
  })
  async create(createPropertyDto: CreatePropertyDto, user: JwtPayloadInterface) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Creating property', {
        correlationId,
        operation: 'create_property',
        module: 'properties',
        userId: user.id,
        userRole: user.role,
        metadata: {
          total_area_ha: createPropertyDto.total_area_ha,
          arable_area_ha: createPropertyDto.arable_area_ha,
          vegetable_area_ha: createPropertyDto.vegetable_area_ha,
          farmer_id: createPropertyDto.farmer_id
        }
      });

      const {
        total_area_ha,
        arable_area_ha,
        vegetable_area_ha,
      } = createPropertyDto;

      const sumAreas = arable_area_ha + vegetable_area_ha;

      if (sumAreas > total_area_ha) {
        const duration = Date.now() - startTime;
        this.logger.warn('Property creation failed: area validation error', {
          correlationId,
          operation: 'create_property',
          module: 'properties',
          duration,
          userId: user.id,
          metadata: {
            total_area_ha,
            arable_area_ha,
            vegetable_area_ha,
            sum_areas: sumAreas,
            error: 'sum_areas_exceeds_total'
          }
        });
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

      this.logger.logDatabaseOperation('create', 'properties', Date.now() - startTime, {
        correlationId,
        userId: user.id,
        operation: 'create_property'
      });

      // Buscar a propriedade criada com todas as relações carregadas
      const propertyWithRelations = await this.propertiesRepository.findOneByIdWithRelations(savedProperty.id);

      if (!propertyWithRelations) {
        const duration = Date.now() - startTime;
        this.logger.error('Failed to retrieve created property', undefined, {
          correlationId,
          operation: 'create_property',
          module: 'properties',
          duration,
          userId: user.id,
          error: 'property_not_found_after_creation',
          metadata: { propertyId: savedProperty.id }
        });
        throw new BadRequestException('Failed to retrieve created property');
      }

      // Transformar os dados para o formato esperado pelo frontend
      const transformedProperty = this.transformPropertyData(propertyWithRelations);

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_property', true, {
        correlationId,
        duration,
        module: 'properties',
        userId: user.id,
        metadata: {
          propertyId: savedProperty.id,
          farmer_id: createPropertyDto.farmer_id,
          areas: {
            total: createPropertyDto.total_area_ha,
            arable: createPropertyDto.arable_area_ha,
            vegetable: createPropertyDto.vegetable_area_ha
          }
        }
      });

      const result = {
        message: 'Property created successfully',
        data: transformedProperty,
      };

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_property', false, {
        correlationId,
        duration,
        module: 'properties',
        userId: user.id,
        error: error.message,
        metadata: { farmer_id: createPropertyDto.farmer_id }
      });
      throw new BadRequestException(
        'Error creating property: ' + error.message,
      );
    }
  }

  @LogOperation({
    operation: 'list_properties',
    module: 'properties',
    logInput: true,
    logOutput: false
  })
  async findAll(user: JwtPayloadInterface, page = 1, limit = 10) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Listing properties', {
        correlationId,
        operation: 'list_properties',
        module: 'properties',
        userId: user.id,
        userRole: user.role,
        metadata: { page, limit }
      });

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

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('list_properties', true, {
        correlationId,
        duration,
        module: 'properties',
        userId: user.id,
        metadata: {
          resultCount: transformedData.length,
          total: result.total,
          page,
          limit
        }
      });

      return {
        data: transformedData,
        total: result.total,
        page: result.page,
        lastPage: Math.ceil(result.total / result.limit),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('list_properties', false, {
        correlationId,
        duration,
        module: 'properties',
        userId: user.id,
        error: error.message,
        metadata: { page, limit }
      });
      throw error;
    }
  }

  @LogOperation({
    operation: 'get_property',
    module: 'properties',
    logInput: true,
    logOutput: true
  })

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
    if (!property) {
      throw new BadRequestException('Property data is required');
    }

    // Agrupar por harvest e organizar crops
    const harvestsMap = new Map();

    // Primeiro, adicionar safras diretas (sem crops)
    if (property.harvests) {
      property.harvests.forEach((harvest: any) => {
        harvestsMap.set(harvest.id, {
          id: harvest.id,
          name: harvest.harvest_name,
          harvest_year: harvest.harvest_year,
          start_date: harvest.start_date,
          end_date: harvest.end_date,
          total_area_ha: harvest.total_area_ha || 0,
          crops: []
        });
      });
    }

    // Em seguida, adicionar crops das relações PropertyCropHarvest
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
        harvest.crops.push({
          id: pch.crop_id,
          name: pch.crop?.crop_name || 'Cultura desconhecida',
          planted_area_ha: pch.planted_area_ha,
          planting_date: pch.planting_date,
          harvest_date: pch.harvest_date
        });

        // Atualizar área total com base nas crops
        const cropsArea = harvest.crops.reduce((sum: number, crop: any) => sum + crop.planted_area_ha, 0);
        if (cropsArea > harvest.total_area_ha) {
          harvest.total_area_ha = cropsArea;
        }
      });
    }

    return {
      id: property.id,
      farm_name: property.farm_name || '',
      city: property.city || '',
      state: property.state || '',
      total_area_ha: property.total_area_ha || 0,
      arable_area_ha: property.arable_area_ha || 0,
      vegetable_area_ha: property.vegetable_area_ha || 0,
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

    // Buscar a propriedade atualizada com todas as relações carregadas
    const propertyWithRelations = await this.propertiesRepository.findOneByIdWithRelations(id);

    // Transformar os dados para o formato esperado pelo frontend
    const transformedProperty = this.transformPropertyData(propertyWithRelations);

    return {
      message: 'Property updated successfully',
      data: transformedProperty,
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

    // Remover todas as relações PropertyCropHarvest antes de deletar a propriedade
    await this.propertyCropHarvestService.removeByPropertyId(id);

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

    // Criar a safra (harvest) com property_id e total_area_ha
    const harvestData = {
      property_id: propertyId,
      harvest_name: data.name,
      harvest_year: new Date().getFullYear(),
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano depois
      total_area_ha: data.total_area_ha
    };

    const newHarvest = await this.harvestsService.create(harvestData);

    return {
      message: 'Harvest created successfully',
      data: newHarvest.data
    };
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

    // Verificar se a safra existe e pertence à propriedade
    const harvest = await this.harvestsService.findOne(harvestId);
    if (!harvest) {
      throw new BadRequestException('Harvest not found');
    }

    // Verificar se a safra pertence à propriedade
    if (harvest.property_id !== propertyId) {
      throw new BadRequestException('Harvest does not belong to this property');
    }

    // Primeiro, remover todas as relações PropertyCropHarvest que envolvem esta safra
    // Isso é necessário devido à restrição de chave estrangeira
    await this.propertyCropHarvestService.removeByHarvestId(harvestId);

    // Agora podemos remover a safra com segurança
    await this.harvestsService.remove(harvestId);

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

    // Primeiro, remover todas as relações PropertyCropHarvest que envolvem esta cultura
    // Isso é necessário devido à restrição de chave estrangeira
    await this.propertyCropHarvestService.removeByCropId(cropId);

    // Agora podemos remover a cultura com segurança
    await this.cropsService.remove(cropId);

    return { message: 'Crop removed successfully' };
  }
}
