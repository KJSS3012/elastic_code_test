import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { Farmer } from "src/shared/decorators/farmer.decorator";
import { AuthGuard } from "./auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Farmer('id') id: string) {
    try {
      return this.authService.getProfile(id);
    } catch (error) {
      throw new Error('Error retrieving profile: ' + error.message);
    }
  }
}