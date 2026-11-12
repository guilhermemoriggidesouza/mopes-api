import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/User.entity';
import { JwtService } from '@nestjs/jwt';
import mail, { MESSAGES } from '../../infra/mail';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async login(login: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { login },
      relations: ['org', 'teamsCreated'],
    });
    const isSamePass = await compare(pass, user.password)
    if (user && isSamePass) {
      const { password, teamsCreated, ...result } = user;
      return {
        access_token: this.jwtService.sign(result),
        route: user.role,
        isMatriz: user.org?.matriz
      };
    }
    throw new BadRequestException('Error on login');
  }

  async recoverPass(email: string, origin: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['org', 'teamsCreated'],
    });
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
        link: `${origin}/recover-password/?id=${user.id}&tempAuth=${encodeURI(
          access_token,
        )}&action=CP`,
      }),
    );
    return { ok: true };
  }
}
