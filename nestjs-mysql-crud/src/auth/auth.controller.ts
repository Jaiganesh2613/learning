import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
