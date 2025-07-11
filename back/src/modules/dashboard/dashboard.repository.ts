import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import { Property } from '../properties/entities/property.entity';
import { Crop } from '../crops/entities/crop.entity';
import { Harvest } from '../harvests/entities/harvest.entity';
import { PropertyCropHarvest } from '../property-crop-harvest/entities/property-crop-harvest.entity';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardRepository {
  constructor(
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(PropertyCropHarvest)
    private readonly propertyCropHarvestRepository: Repository<PropertyCropHarvest>,
  ) { }

  async getTotalFarmers(filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.farmerRepository.createQueryBuilder('farmer');

    if (filters?.state || filters?.city) {
      queryBuilder
        .leftJoin(Property, 'property', 'property.farmer_id = farmer.id');

      if (filters.state) {
        queryBuilder.andWhere('property.state = :state', { state: filters.state });
      }

      if (filters.city) {
        queryBuilder.andWhere('property.city = :city', { city: filters.city });
      }
    }

    return queryBuilder.getCount();
  }

  async getFarmersByState(filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin(Farmer, 'farmer', 'farmer.id = property.farmer_id')
      .select('property.state', 'state')
      .addSelect('COUNT(DISTINCT farmer.id)', 'count')
      .where('property.state IS NOT NULL');

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .groupBy('property.state')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getFarmersByCities(filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin(Farmer, 'farmer', 'farmer.id = property.farmer_id')
      .select('property.city', 'city')
      .addSelect('COUNT(DISTINCT farmer.id)', 'count')
      .where('property.city IS NOT NULL');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .groupBy('property.city')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getTotalProperties(filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder.getCount();
  }

  async getTotalHectares(filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('SUM(property.total_area_ha)', 'total');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result?.total) || 0;
  }

  async getCropDistribution(filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyCropHarvestRepository
      .createQueryBuilder('pch')
      .leftJoin(Crop, 'crop', 'crop.id = pch.crop_id')
      .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
      .leftJoin(Property, 'property', 'property.id = pch.property_id')
      .select('crop.crop_name', 'name')
      .addSelect('SUM(pch.planted_area_ha)', 'area')
      .where('crop.crop_name IS NOT NULL');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder.andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .groupBy('crop.crop_name')
      .orderBy('area', 'DESC')
      .getRawMany();
  }

  async getLandUseDistribution(filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('SUM(property.arable_area_ha)', 'arable_area')
      .addSelect('SUM(property.vegetable_area_ha)', 'vegetation_area');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    const result = await queryBuilder.getRawOne();
    return [
      { name: 'Área Agricultável', value: parseFloat(result?.arable_area) || 0 },
      { name: 'Vegetação', value: parseFloat(result?.vegetation_area) || 0 }
    ];
  }

  async getFarmerProperties(farmerId: string, filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('property.farm_name', 'name')
      .addSelect('property.total_area_ha', 'totalArea')
      .where('property.farmer_id = :farmerId', { farmerId });

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .orderBy('property.total_area_ha', 'DESC')
      .getRawMany();
  }

  async getFarmerCrops(farmerId: string, filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyCropHarvestRepository
      .createQueryBuilder('pch')
      .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
      .leftJoin(Property, 'property', 'property.id = pch.property_id')
      .leftJoin(Crop, 'crop', 'crop.id = pch.crop_id')
      .select('crop.crop_name', 'name')
      .addSelect('SUM(pch.planted_area_ha)', 'area')
      .where('property.farmer_id = :farmerId', { farmerId })
      .andWhere('crop.crop_name IS NOT NULL');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder.andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .groupBy('crop.crop_name')
      .orderBy('area', 'DESC')
      .getRawMany();
  }

  async getFarmerLandUse(farmerId: string, filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('SUM(property.arable_area_ha)', 'arable_area')
      .addSelect('SUM(property.vegetable_area_ha)', 'vegetation_area')
      .where('property.farmer_id = :farmerId', { farmerId });

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    const result = await queryBuilder.getRawOne();
    return [
      { name: 'Área Agricultável', value: parseFloat(result?.arable_area) || 0 },
      { name: 'Vegetação', value: parseFloat(result?.vegetation_area) || 0 }
    ];
  }

  async getFarmerTotalHectares(farmerId: string, filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('SUM(property.total_area_ha)', 'total')
      .where('property.farmer_id = :farmerId', { farmerId });

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result?.total) || 0;
  }

  async getFarmerActiveHarvests(farmerId: string, filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.harvestRepository
      .createQueryBuilder('harvest')
      .leftJoin(PropertyCropHarvest, 'pch', 'pch.harvest_id = harvest.id')
      .leftJoin(Property, 'property', 'property.id = pch.property_id')
      .where('property.farmer_id = :farmerId', { farmerId });

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder.andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder.getCount();
  }

  async getFarmerTotalCrops(farmerId: string, filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.propertyCropHarvestRepository
      .createQueryBuilder('pch')
      .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
      .leftJoin(Property, 'property', 'property.id = pch.property_id')
      .select('COUNT(DISTINCT pch.crop_id)', 'count')
      .where('property.farmer_id = :farmerId', { farmerId })
      .andWhere('pch.crop_id IS NOT NULL');

    if (filters?.state) {
      queryBuilder.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder.andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    const result = await queryBuilder.getRawOne();
    return parseInt(result?.count) || 0;
  }

  async getAreaByState(filters?: DashboardQueryDto): Promise<any[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .select('property.state', 'state')
      .addSelect('SUM(property.total_area_ha)', 'totalArea')
      .where('property.state IS NOT NULL');

    if (filters?.city) {
      queryBuilder.andWhere('property.city = :city', { city: filters.city });
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.property_id = property.id')
        .leftJoin(Harvest, 'harvest', 'harvest.id = pch.harvest_id')
        .andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder
      .groupBy('property.state')
      .orderBy('SUM(property.total_area_ha)', 'DESC')
      .getRawMany();
  }

  async getTotalActiveHarvests(filters?: DashboardQueryDto): Promise<number> {
    const queryBuilder = this.harvestRepository.createQueryBuilder('harvest');

    if (filters?.state || filters?.city) {
      queryBuilder
        .leftJoin(PropertyCropHarvest, 'pch', 'pch.harvest_id = harvest.id')
        .leftJoin(Property, 'property', 'property.id = pch.property_id');

      if (filters.state) {
        queryBuilder.andWhere('property.state = :state', { state: filters.state });
      }

      if (filters.city) {
        queryBuilder.andWhere('property.city = :city', { city: filters.city });
      }
    }

    // Só aplicar filtro de ano se especificamente fornecido
    if (filters?.year && filters.year > 0) {
      queryBuilder.andWhere('harvest.harvest_year = :year', { year: filters.year });
    }

    return queryBuilder.getCount();
  }
}
