import { BadRequestException, Injectable } from '@nestjs/common';
import { FarmersRepository } from './farmers.repository';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateFarmerPasswordDto } from './dto/update-farmer-password.dto';
import { FarmerListDto } from './dto/farmer-list.dto';
import { FarmerDetailDto } from './dto/farmer-detail.dto';
import { plainToInstance } from 'class-transformer';
import { Farmer } from './entities/farmer.entity';
@Injectable()
export class FarmersService {
  constructor(
    private readonly farmersRepository: FarmersRepository,
    private readonly configService: ConfigService,
  ) { }

  async create(CreateFarmerDto: CreateFarmerDto) {
    try {
      const existingFarmer = await this.farmersRepository.findOneByEmail(
        CreateFarmerDto.email,
      );

      if (existingFarmer) {
        throw new BadRequestException('Farmer email already exists');
      }

      const hashedPassword = await this.hashPassword(CreateFarmerDto.password);
      CreateFarmerDto.password = hashedPassword;
      const farmer = this.farmersRepository.createEntity(CreateFarmerDto);
      await this.farmersRepository.save(farmer);

      return {
        message: 'Farmer created successfully',
        data: {
          id: farmer.id,
        },
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'Farmer with this CPF or CNPJ already exists',
        );
      }
      throw new BadRequestException('Error creating farmer: ' + error.message);
    }
  }

  async findAll(page = 1, limit = 10) {
    const result = await this.farmersRepository.findAll(page, limit);
    return {
      data: plainToInstance(FarmerListDto, result.data),
      total: result.total,
      page: result.page,
      lastPage: Math.ceil(result.total / result.limit),
    };
  }

  async findOne(id: string) {
    try {
      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        throw new BadRequestException('Farmer not found');
      }
      return plainToInstance(FarmerDetailDto, farmer);
    } catch (error) {
      throw new BadRequestException('Error finding farmer: ' + error.message);
    }
  }

  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    try {
      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        throw new BadRequestException('Farmer not found');
      }

      if (updateFarmerDto.email && updateFarmerDto.email !== farmer.email) {
        const existingFarmerWithEmail = await this.farmersRepository.findOneByEmail(updateFarmerDto.email);
        if (existingFarmerWithEmail) {
          throw new BadRequestException('Email already exists');
        }
      }

      if (updateFarmerDto.cpf && updateFarmerDto.cpf !== farmer.cpf) {
        const existingFarmerWithCpf = await this.farmersRepository.findOneByCpf(updateFarmerDto.cpf);
        if (existingFarmerWithCpf) {
          throw new BadRequestException('CPF already exists');
        }
      }

      if ('password' in updateFarmerDto) {
        delete updateFarmerDto.password;
      }

      Object.assign(farmer, updateFarmerDto);
      await this.farmersRepository.update(farmer);
      return { message: 'Farmer updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error updating farmer: ' + error.message);
    }
  }

  async updatePassword(id: string, dto: UpdateFarmerPasswordDto) {
    try {
      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        throw new BadRequestException('Farmer not found');
      }
      const hashedPassword = await this.hashPassword(dto.password as string);
      farmer.password = hashedPassword;
      await this.farmersRepository.update(farmer);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException(
        'Error updating password: ' + error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        throw new BadRequestException('Farmer not found');
      }
      await this.farmersRepository.remove(id);
      return { message: 'Farmer removed successfully' };
    } catch (error) {
      throw new BadRequestException('Error removing farmer: ' + error.message);
    }
  }

  // Aux functions

  async hashPassword(password: string): Promise<string> {
    const saltEnv = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const saltRounds = parseInt(saltEnv ?? '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, farmer_pass: string): Promise<boolean> {
    if (!(await bcrypt.compare(password, farmer_pass))) {
      throw new BadRequestException('Invalid password');
    }
    return true;
  }
}
