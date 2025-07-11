import { BadRequestException, Injectable } from "@nestjs/common";
import { HavestRepository } from "./harvests.repository";
import { CreateHarvestDto } from "./dto/create-harvest.dto";
import { UpdateHarvestDto } from "./dto/update-harvest.dto";

@Injectable()
export class HarvestsService {
  constructor(private readonly harvestRepository: HavestRepository) { }

  async create(createHasvestDto: CreateHarvestDto) {
    try {
      const harvest = this.harvestRepository.createEntity(createHasvestDto);
      await this.harvestRepository.save(harvest);

      return {
        message: "Harvest created successfully",
        data: {
          id: harvest.id,
        },
      }
    } catch (error) {
      throw new BadRequestException("Error creating harvest: " + error.message);
    }

  }
  async findAll(page = 1, limit = 10) {
    const result = await this.harvestRepository.findAll(page, limit);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    };
  }

  async findOne(id: string) {
    const harvest = await this.harvestRepository.findOneById(id);
    if (!harvest) {
      throw new BadRequestException("Harvest not found");
    }
    return harvest;
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto) {
    const harvest = await this.harvestRepository.findOneById(id);
    if (!harvest) {
      throw new BadRequestException("Harvest not found");
    }
    Object.assign(harvest, updateHarvestDto);
    await this.harvestRepository.save(harvest);
    return {
      message: "Harvest updated successfully",
      data: {
        id: harvest.id,
      },
    };
  }

  async remove(id: string) {
    const harvest = await this.harvestRepository.findOneById(id);
    if (!harvest) {
      throw new BadRequestException("Harvest not found");
    }
    await this.harvestRepository.remove(id);
    return {
      message: "Harvest removed successfully",
    };
  }

  async removeByPropertyId(propertyId: string) {
    await this.harvestRepository.removeByPropertyId(propertyId);
    return {
      message: "Harvests removed successfully",
    };
  }
}