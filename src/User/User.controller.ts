import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
const urlBase: string = "/user"

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(`${urlBase}`)
    async findAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(`${urlBase}/:id`)
    async findOne(@Param("id") id: string): Promise<User> {
        return await this.userService.findOne({ id });
    }

    @Post(`${urlBase}`)
    async createUser(@Body() payload: User): Promise<User> {
        return await this.userService.create(payload);
    }

    @Post(`${urlBase}/:id`)
    async editUsers(@Param("id") id: string, @Body() payload: User): Promise<object> {
        return await this.userService.edit(id, (payload as object));
    }

    @Delete(`${urlBase}/:id`)
    async removeUser(@Param("id") id: string): Promise<object> {
        return await this.userService.remove(id);
    }
}
