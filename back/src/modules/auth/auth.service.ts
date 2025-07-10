import { Injectable, UnauthorizedException } from "@nestjs/common";
import { FarmersService } from "../farmers/farmers.service";
import { FarmersRepository } from "../farmers/farmers.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly farmerService: FarmersService,
    private readonly farmersRepository: FarmersRepository,
    private readonly jwtService: JwtService
  ) { }

  async signIn(loginDto: LoginDto): Promise<any> {
    const farmer = await this.farmersRepository.findOneByEmail(loginDto.email);

    if (!farmer) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!(await this.farmerService.validatePassword(loginDto.password, farmer.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwtService.sign({ id: farmer.id, role: farmer.role })
    const refreshToken = this.jwtService.sign({ id: farmer.id, role: farmer.role }, {
      expiresIn: '7d',
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
  }

  async getProfile(farmerId: string): Promise<any> {
    const farmer = await this.farmersRepository.findOneById(farmerId);

    if (!farmer) {
      throw new UnauthorizedException("Farmer not found");
    }

    return {
      id: farmer.id,
      producer_name: farmer.producer_name,
      email: farmer.email,
      cpf: farmer.cpf,
      cnpj: farmer.cnpj,
      phone: farmer.phone,
      role: farmer.role // Usar o role real do usuário
    };
  }
}