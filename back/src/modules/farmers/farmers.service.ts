import { Injectable } from "@nestjs/common";
import { FarmersRepository } from "./farmers.repository";
import { CreateFarmerDto } from "./dto/create-farmer.dto";
import { UpdateFarmerDto } from "./dto/update-farmer.dto";

@Injectable()
export class FarmersService {
  constructor(private readonly farmersRepository: FarmersRepository) { }

  create(CreateFarmerDto: CreateFarmerDto) { }

  findAll() { }

  findOne(id: string) { }

  update(id: string, updateFarmerDto: UpdateFarmerDto) { }

  remove(id: string) { }
}