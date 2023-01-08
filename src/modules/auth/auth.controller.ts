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
import { User } from 'src/modules/user/User.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/User.service';
const urlBase = '/auth';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post(`${urlBase}/login`)
  async login(@Body() payload: login): Promise<User> {
    return await this.authService.login(payload.login, payload.password);
  }
  @Post(`${urlBase}/sign`)
  async sign(@Body() payload: any): Promise<User> {
    return await this.userService.create(payload);
  }

  @Post(`${urlBase}/recover-password`)
  async recoverPass(@Body() payload: recoverPass): Promise<any> {
    return await this.authService.recoverPass(payload.email, payload.origin);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`${urlBase}/profile`)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
