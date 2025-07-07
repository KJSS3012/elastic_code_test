import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Crop } from "./entities/crop.entity";
import { Repository } from "typeorm";
import { CreateCropDto } from "./dto/create-crop.dto";

@Injectable()
export class CropsRepository {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>) { }

  createEntity(createCropDto: CreateCropDto): Crop {
    const crop = this.cropRepository.create(createCropDto);
    return crop;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Crop[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.cropRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneById(id: string) {
    return this.cropRepository.findOne({ where: { id } });
  }

  async save(crop: Crop): Promise<Crop> {
    return this.cropRepository.save(crop);
  }

  async update(crop: Crop): Promise<Crop> {
    return this.cropRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    await this.cropRepository.delete(id);
  }
}