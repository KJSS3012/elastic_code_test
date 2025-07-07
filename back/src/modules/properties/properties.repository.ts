import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Property } from "./entities/property.entity";
import { Repository } from "typeorm";
import { CreatePropertyDto } from "./dto/create-property.dto";

@Injectable()
export class PropertiesRepository {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) { }

  createEntity(createPropertyDto: CreatePropertyDto): Property {
    const property = this.propertiesRepository.create(createPropertyDto);
    return property;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Property[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.propertiesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneById(id: string) {
    return this.propertiesRepository.findOne({ where: { id } });
  }

  async save(property: Property): Promise<Property> {
    return this.propertiesRepository.save(property);
  }

  async update(property: Property): Promise<Property> {
    return this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}