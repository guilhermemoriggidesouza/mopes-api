import { RolesGuard } from 'src/role.guard';
import { Roles } from '../role.decorators';
import { Role } from './../role.enum';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
const urlBase: string = "/user"

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Get(`${urlBase}`)
    @Roles(Role.Admin)
    async findAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }
    
    @Get(`${urlBase}/:id`)
    @Roles(Role.Player, Role.Admin)
    async findOne(@Param("id") id: string): Promise<User> {
        return await this.userService.findOne({ id });
    }
    
    @Post(`${urlBase}`)
    @Roles(Role.Admin)
    async createUser(@Body() payload: User): Promise<User> {
        return await this.userService.create(payload);
    }

    @Post(`${urlBase}/:id`)
    @Roles(Role.Player)
    @Roles(Role.Admin)
    async editUsers(@Param("id") id: string, @Body() payload: User): Promise<object> {
        return await this.userService.edit(id, (payload as object));
    }

    @Delete(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async removeUser(@Param("id") id: string): Promise<object> {
        return await this.userService.remove(id);
    }
}
