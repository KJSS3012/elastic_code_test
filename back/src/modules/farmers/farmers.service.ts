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
import { LoggerService } from '../../shared/logging/logger.service';
import { LogOperation } from '../../shared/logging/log-operation.decorator';

@Injectable()
export class FarmersService {
  constructor(
    private readonly farmersRepository: FarmersRepository,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) { }

  @LogOperation({
    operation: 'create_farmer',
    module: 'farmers',
    logInput: true,
    logOutput: true,
    sensitiveFields: ['password']
  })
  async create(CreateFarmerDto: CreateFarmerDto) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Creating farmer', {
        correlationId,
        operation: 'create_farmer',
        module: 'farmers',
        metadata: {
          email: CreateFarmerDto.email,
          producer_name: CreateFarmerDto.producer_name
        }
      });

      // Validar se pelo menos CPF ou CNPJ foi fornecido
      if (!CreateFarmerDto.cpf && !CreateFarmerDto.cnpj) {
        const duration = Date.now() - startTime;
        this.logger.warn('Farmer creation failed: neither CPF nor CNPJ provided', {
          correlationId,
          operation: 'create_farmer',
          module: 'farmers',
          duration,
          metadata: { email: CreateFarmerDto.email }
        });
        throw new BadRequestException('Either CPF or CNPJ must be provided');
      }

      const existingFarmer = await this.farmersRepository.findOneByEmail(
        CreateFarmerDto.email,
      );

      if (existingFarmer) {
        const duration = Date.now() - startTime;
        this.logger.warn('Farmer creation failed: email already exists', {
          correlationId,
          operation: 'create_farmer',
          module: 'farmers',
          duration,
          metadata: { email: CreateFarmerDto.email }
        });
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(CreateFarmerDto.password);
      CreateFarmerDto.password = hashedPassword;
      const farmer = this.farmersRepository.createEntity(CreateFarmerDto);
      await this.farmersRepository.save(farmer);

      this.logger.logDatabaseOperation('create', 'farmers', Date.now() - startTime, {
        correlationId,
        userId: farmer.id,
        operation: 'create_farmer'
      });

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_farmer', true, {
        correlationId,
        duration,
        module: 'farmers',
        userId: farmer.id,
        metadata: {
          email: CreateFarmerDto.email,
          producer_name: CreateFarmerDto.producer_name
        }
      });

      return {
        message: 'Farmer created successfully',
        data: {
          id: farmer.id,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('create_farmer', false, {
        correlationId,
        duration,
        module: 'farmers',
        error: error.message,
        metadata: { email: CreateFarmerDto.email }
      });

      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException as is
      }
      if (error.code === '23505') {
        throw new BadRequestException('CPF or CNPJ already exists');
      }
      throw new BadRequestException(`Error creating farmer: ${error.message}`);
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error finding farmer: ${error.message}`);
    }
  }

  @LogOperation({
    operation: 'update_farmer',
    module: 'farmers',
    logInput: true,
    logOutput: true,
    sensitiveFields: ['password']
  })
  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Updating farmer', {
        correlationId,
        operation: 'update_farmer',
        module: 'farmers',
        metadata: {
          farmerId: id,
          updates: Object.keys(updateFarmerDto)
        }
      });

      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        const duration = Date.now() - startTime;
        this.logger.warn('Farmer not found for update', {
          correlationId,
          operation: 'update_farmer',
          module: 'farmers',
          duration,
          metadata: { farmerId: id }
        });
        throw new BadRequestException('Farmer not found');
      }

      if (updateFarmerDto.email && updateFarmerDto.email !== farmer.email) {
        const existingFarmerWithEmail = await this.farmersRepository.findOneByEmail(updateFarmerDto.email);
        if (existingFarmerWithEmail) {
          const duration = Date.now() - startTime;
          this.logger.warn('Farmer update failed: email already exists', {
            correlationId,
            operation: 'update_farmer',
            module: 'farmers',
            duration,
            metadata: { farmerId: id, email: updateFarmerDto.email }
          });
          throw new BadRequestException('Email already exists');
        }
      }

      if (updateFarmerDto.cpf && updateFarmerDto.cpf !== farmer.cpf) {
        const existingFarmerWithCpf = await this.farmersRepository.findOneByCpf(updateFarmerDto.cpf);
        if (existingFarmerWithCpf) {
          const duration = Date.now() - startTime;
          this.logger.warn('Farmer update failed: CPF already exists', {
            correlationId,
            operation: 'update_farmer',
            module: 'farmers',
            duration,
            metadata: { farmerId: id, cpf: updateFarmerDto.cpf }
          });
          throw new BadRequestException('CPF already exists');
        }
      }

      if ('password' in updateFarmerDto) {
        delete updateFarmerDto.password;
      }

      Object.assign(farmer, updateFarmerDto);
      await this.farmersRepository.update(farmer);

      this.logger.logDatabaseOperation('update', 'farmers', Date.now() - startTime, {
        correlationId,
        userId: id,
        operation: 'update_farmer'
      });

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('update_farmer', true, {
        correlationId,
        duration,
        module: 'farmers',
        userId: id,
        metadata: {
          updates: Object.keys(updateFarmerDto),
          email: updateFarmerDto.email
        }
      });

      return { message: 'Farmer updated successfully' };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('update_farmer', false, {
        correlationId,
        duration,
        module: 'farmers',
        userId: id,
        error: error.message,
        metadata: { updates: Object.keys(updateFarmerDto) }
      });

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

  @LogOperation({
    operation: 'delete_farmer',
    module: 'farmers',
    logInput: true
  })
  async remove(id: string) {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Deleting farmer', {
        correlationId,
        operation: 'delete_farmer',
        module: 'farmers',
        metadata: { farmerId: id }
      });

      const farmer = await this.farmersRepository.findOneById(id);
      if (!farmer) {
        const duration = Date.now() - startTime;
        this.logger.warn('Farmer not found for deletion', {
          correlationId,
          operation: 'delete_farmer',
          module: 'farmers',
          duration,
          metadata: { farmerId: id }
        });
        throw new BadRequestException('Farmer not found');
      }

      await this.farmersRepository.remove(id);

      this.logger.logDatabaseOperation('delete', 'farmers', Date.now() - startTime, {
        correlationId,
        userId: id,
        operation: 'delete_farmer'
      });

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('delete_farmer', true, {
        correlationId,
        duration,
        module: 'farmers',
        userId: id,
        metadata: {
          email: farmer.email,
          producer_name: farmer.producer_name
        }
      });

      return { message: 'Farmer removed successfully' };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('delete_farmer', false, {
        correlationId,
        duration,
        module: 'farmers',
        userId: id,
        error: error.message
      });
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
