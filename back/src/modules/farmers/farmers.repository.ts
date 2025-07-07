import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { Repository } from 'typeorm';
import { CreateFarmerDto } from './dto/create-farmer.dto';

@Injectable()
export class FarmersRepository {
  constructor(
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
  ) { }

  createEntity(createFarmerDto: CreateFarmerDto): Farmer {
    const farmer = this.farmerRepository.create(createFarmerDto);
    return farmer;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Farmer[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.farmerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneById(id: string) {
    return this.farmerRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.farmerRepository.findOne({ where: { email } });
  }

  async findOneByCpf(cpf: string) {
    return this.farmerRepository.findOne({ where: { cpf } });
  }

  async save(farmer: Farmer): Promise<Farmer> {
    return this.farmerRepository.save(farmer);
  }

  async update(farmer: Farmer): Promise<Farmer> {
    return this.farmerRepository.save(farmer);
  }

  async remove(id: string): Promise<void> {
    await this.farmerRepository.delete(id);
  }
}
