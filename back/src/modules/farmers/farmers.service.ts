import { BadRequestException, Injectable } from '@nestjs/common';
import { FarmersRepository } from './farmers.repository';
import { PropertiesRepository } from '../properties/properties.repository';
import { PropertyCropHarvestRepository } from '../property-crop-harvest/property-crop-harvest.repository';
import { HavestRepository } from '../harvests/harvests.repository';
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
    private readonly propertiesRepository: PropertiesRepository,
    private readonly propertyCropHarvestRepository: PropertyCropHarvestRepository,
    private readonly harvestsRepository: HavestRepository,
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
          producer_name: CreateFarmerDto.producer_name,
          cpf: CreateFarmerDto.cpf,
          cnpj: CreateFarmerDto.cnpj,
          cpf_length: CreateFarmerDto.cpf?.length,
          cnpj_length: CreateFarmerDto.cnpj?.length
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

      // Normalizar CPF removendo caracteres especiais e espaços
      if (CreateFarmerDto.cpf) {
        CreateFarmerDto.cpf = CreateFarmerDto.cpf.replace(/\D/g, '').trim();
      }
      
      // Normalizar CNPJ removendo caracteres especiais e espaços
      if (CreateFarmerDto.cnpj) {
        CreateFarmerDto.cnpj = CreateFarmerDto.cnpj.replace(/\D/g, '').trim();
      }

      // Verificar se CPF já existe (se fornecido)
      if (CreateFarmerDto.cpf) {
        this.logger.log('Checking CPF existence', {
          correlationId,
          metadata: { cpf: CreateFarmerDto.cpf, cpf_type: typeof CreateFarmerDto.cpf }
        });
        
        const existingFarmerByCpf = await this.farmersRepository.findOneByCpf(CreateFarmerDto.cpf);
        
        this.logger.log('CPF check result', {
          correlationId,
          metadata: { 
            cpf: CreateFarmerDto.cpf, 
            exists: !!existingFarmerByCpf,
            existingId: existingFarmerByCpf?.id 
          }
        });
        
        if (existingFarmerByCpf) {
          const duration = Date.now() - startTime;
          this.logger.warn('Farmer creation failed: CPF already exists', {
            correlationId,
            operation: 'create_farmer',
            module: 'farmers',
            duration,
            metadata: { cpf: CreateFarmerDto.cpf }
          });
          throw new BadRequestException('CPF already exists');
        }
      }

      // Verificar se CNPJ já existe (se fornecido)
      if (CreateFarmerDto.cnpj) {
        const existingFarmerByCnpj = await this.farmersRepository.findOneByCnpj(CreateFarmerDto.cnpj);
        if (existingFarmerByCnpj) {
          const duration = Date.now() - startTime;
          this.logger.warn('Farmer creation failed: CNPJ already exists', {
            correlationId,
            operation: 'create_farmer',
            module: 'farmers',
            duration,
            metadata: { cnpj: CreateFarmerDto.cnpj }
          });
          throw new BadRequestException('CNPJ already exists');
        }
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
      this.logger.log('Deleting farmer with cascade', {
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

      // Step 1: Find all properties belonging to this farmer (get all pages)
      const propertiesResult = await this.propertiesRepository.findByFarmerId(id, 1, 1000);
      const properties = propertiesResult.data;

      this.logger.log('Found properties for cascade delete', {
        correlationId,
        operation: 'delete_farmer',
        module: 'farmers',
        metadata: {
          farmerId: id,
          propertiesCount: properties.length,
          propertyIds: properties.map(p => p.id)
        }
      });

      // Step 2: For each property, delete related records using specific methods
      for (const property of properties) {
        // Delete PropertyCropHarvest records for this property
        await this.propertyCropHarvestRepository.removeByPropertyId(property.id);

        this.logger.log('Deleted PropertyCropHarvest records', {
          correlationId,
          operation: 'delete_farmer',
          module: 'farmers',
          metadata: {
            farmerId: id,
            propertyId: property.id
          }
        });

        // Delete Harvest records for this property
        await this.harvestsRepository.removeByPropertyId(property.id);

        this.logger.log('Deleted Harvest records', {
          correlationId,
          operation: 'delete_farmer',
          module: 'farmers',
          metadata: {
            farmerId: id,
            propertyId: property.id
          }
        });

        // Step 3: Delete the property itself
        await this.propertiesRepository.remove(property.id);

        this.logger.log('Deleted property', {
          correlationId,
          operation: 'delete_farmer',
          module: 'farmers',
          metadata: {
            farmerId: id,
            propertyId: property.id,
            propertyName: property.farm_name
          }
        });
      }

      // Step 4: Finally, delete the farmer
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
          producer_name: farmer.producer_name,
          propertiesDeleted: properties.length
        }
      });

      return {
        message: 'Farmer and all related data removed successfully',
        deletedItems: {
          farmer: 1,
          properties: properties.length,
          relatedRecords: 'PropertyCropHarvest and Harvest records deleted'
        }
      };
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
