import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './User.entity';
import { UserService } from './User.service';
const urlBase: string = "/user"

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(`${urlBase}`)
    async findAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(`${urlBase}/:id`)
    async findOne(@Param("id") id: string): Promise<User> {
        return await this.userService.findOne(id);
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
