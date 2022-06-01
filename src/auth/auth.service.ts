import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async login(login: string, pass: string): Promise<any> {
        const user = await this.userService.findOne({ where: { login } });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return {
                access_token: this.jwtService.sign(result),
            };
        }
        return null;
    }
}
