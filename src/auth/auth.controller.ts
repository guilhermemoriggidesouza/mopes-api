import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/User.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
const urlBase: string = '/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`${urlBase}/login`)
  async login(@Body() payload: login): Promise<User> {
    return await this.authService.login(payload.login, payload.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`${urlBase}/profile`)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
