import { Injectable, UnauthorizedException } from "@nestjs/common";
import { FarmersService } from "../farmers/farmers.service";
import { FarmersRepository } from "../farmers/farmers.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { LoggerService } from "../../shared/logging/logger.service";
import { LogOperation } from "../../shared/logging/log-operation.decorator";

@Injectable()
export class AuthService {
  constructor(
    private readonly farmerService: FarmersService,
    private readonly farmersRepository: FarmersRepository,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) { }

  @LogOperation({
    operation: 'user_login',
    module: 'auth',
    logInput: false, // Não logar senha
    logOutput: false, // Não logar tokens
    sensitiveFields: ['password', 'accessToken', 'refreshToken']
  })
  async signIn(loginDto: LoginDto): Promise<any> {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('User login attempt', {
        correlationId,
        operation: 'user_login',
        module: 'auth',
        metadata: {
          email: loginDto.email,
          userAgent: 'unknown' // Será preenchido pelo middleware
        }
      });

      const farmer = await this.farmersRepository.findOneByEmail(loginDto.email);

      if (!farmer) {
        const duration = Date.now() - startTime;
        this.logger.warn('Login failed - user not found', {
          correlationId,
          operation: 'user_login',
          module: 'auth',
          duration,
          metadata: { email: loginDto.email }
        });
        throw new UnauthorizedException("Invalid credentials");
      }

      if (!(await this.farmerService.validatePassword(loginDto.password, farmer.password))) {
        const duration = Date.now() - startTime;
        this.logger.warn('Login failed - invalid password', {
          correlationId,
          operation: 'user_login',
          module: 'auth',
          duration,
          userId: farmer.id,
          metadata: { email: loginDto.email }
        });
        throw new UnauthorizedException("Invalid credentials");
      }

      const accessToken = this.jwtService.sign({ id: farmer.id, role: farmer.role });
      const refreshToken = this.jwtService.sign({ id: farmer.id, role: farmer.role }, {
        expiresIn: '7d',
      });

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('user_login', true, {
        correlationId,
        duration,
        module: 'auth',
        userId: farmer.id,
        userRole: farmer.role,
        metadata: {
          email: loginDto.email,
          loginSuccess: true
        }
      });

      return {
        token: accessToken, // Frontend espera 'token'
        refreshToken,
        user: {
          id: farmer.id,
          producer_name: farmer.producer_name,
          email: farmer.email,
          role: farmer.role // Usar o role real do usuário
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('user_login', false, {
        correlationId,
        duration,
        module: 'auth',
        error: error.message,
        metadata: { email: loginDto.email }
      });
      throw error;
    }
  }

  @LogOperation({
    operation: 'get_user_profile',
    module: 'auth',
    logInput: true,
    logOutput: false // Não logar dados sensíveis do perfil
  })
  async getProfile(farmerId: string): Promise<any> {
    const correlationId = this.logger.generateCorrelationId();
    const startTime = Date.now();

    try {
      this.logger.log('Fetching user profile', {
        correlationId,
        operation: 'get_user_profile',
        module: 'auth',
        userId: farmerId
      });

      const farmer = await this.farmersRepository.findOneById(farmerId);

      if (!farmer) {
        const duration = Date.now() - startTime;
        this.logger.warn('Profile not found', {
          correlationId,
          operation: 'get_user_profile',
          module: 'auth',
          duration,
          userId: farmerId
        });
        throw new UnauthorizedException("Farmer not found");
      }

      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('get_user_profile', true, {
        correlationId,
        duration,
        module: 'auth',
        userId: farmerId,
        metadata: {
          email: farmer.email,
          role: farmer.role
        }
      });

      return {
        id: farmer.id,
        producer_name: farmer.producer_name,
        email: farmer.email,
        cpf: farmer.cpf,
        cnpj: farmer.cnpj,
        phone: farmer.phone,
        role: farmer.role // Usar o role real do usuário
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logBusinessOperation('get_user_profile', false, {
        correlationId,
        duration,
        module: 'auth',
        userId: farmerId,
        error: error.message
      });
      throw error;
    }
  }
}