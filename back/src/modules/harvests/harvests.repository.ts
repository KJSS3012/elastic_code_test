import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { Repository } from 'typeorm';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@Injectable()
export class HavestRepository {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) { }

  createEntity(createHarvestDto: CreateHarvestDto): Harvest {
    const harvest = this.harvestRepository.create(createHarvestDto);
    return harvest;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Harvest[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.harvestRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneById(id: string) {
    return this.harvestRepository.findOne({ where: { id } });
  }

  async save(harvest: Harvest): Promise<Harvest> {
    return this.harvestRepository.save(harvest);
  }

  async update(harvest: Harvest): Promise<Harvest> {
    return this.harvestRepository.save(harvest);
  }

  async remove(id: string): Promise<void> {
    await this.harvestRepository.delete(id);
  }
}
