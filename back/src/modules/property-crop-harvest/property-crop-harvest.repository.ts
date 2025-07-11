import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyCropHarvest } from "./entities/property-crop-harvest.entity";
import { Repository } from "typeorm";
import { CreatePropertyCropHarvestDto } from "./dto/create-property-crop-harvest.dto";

@Injectable()
export class PropertyCropHarvestRepository {
  constructor(
    @InjectRepository(PropertyCropHarvest)
    private readonly propertyCropHarvestRepository: Repository<PropertyCropHarvest>,
  ) { }

  createEntity(createPropertyCropHarvestDto: CreatePropertyCropHarvestDto): PropertyCropHarvest {
    const propertyCropHarvest = this.propertyCropHarvestRepository.create(createPropertyCropHarvestDto);
    return propertyCropHarvest;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: PropertyCropHarvest[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.propertyCropHarvestRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneById(id: string): Promise<PropertyCropHarvest | null> {
    return this.propertyCropHarvestRepository.findOne({ where: { id } });
  }

  async save(propertyCropHarvest: PropertyCropHarvest): Promise<PropertyCropHarvest> {
    return this.propertyCropHarvestRepository.save(propertyCropHarvest);
  }

  async update(propertyCropHarvest: PropertyCropHarvest): Promise<PropertyCropHarvest> {
    const now = new Date();
    const formattedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    propertyCropHarvest.updatedAt = formattedDate;
    return this.propertyCropHarvestRepository.save(propertyCropHarvest);
  }

  async remove(id: string): Promise<void> {
    await this.propertyCropHarvestRepository.delete(id);
  }

  async removeByCropId(cropId: string): Promise<void> {
    await this.propertyCropHarvestRepository.delete({ crop_id: cropId });
  }

  async removeByHarvestId(harvestId: string): Promise<void> {
    await this.propertyCropHarvestRepository.delete({ harvest_id: harvestId });
  }

  async removeByPropertyId(propertyId: string): Promise<void> {
    await this.propertyCropHarvestRepository.delete({ property_id: propertyId });
  }
}