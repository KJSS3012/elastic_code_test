import { Injectable } from "@nestjs/common";
import { FarmersService } from "../farmers/farmers.service";
import { FarmersRepository } from "../farmers/farmers.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { log } from "console";

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
      throw new Error("Farmer not found");
    }

    if (!(await this.farmerService.validatePassword(loginDto.password, farmer.password))) {
      throw new Error("Invalid password");
    }

    const accessToken = this.jwtService.sign({ id: farmer.id })
    const refreshToken = this.jwtService.sign({ id: farmer.id }, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}