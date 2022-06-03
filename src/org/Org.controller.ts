import { RolesGuard } from 'src/role.guard';
import { Roles } from '../role.decorators';
import { Role } from '../role.enum';
import { Body, Controller, Delete, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Org } from './Org.entity';
import { OrgService } from './Org.service';
const urlBase: string = "/org"

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrgController {
    constructor(private readonly orgService: OrgService) { }
    
    @Get(`${urlBase}`)
    @Roles(Role.Admin)
    async findAllOrgs(): Promise<Org[]> {
        return await this.orgService.findAll();
    }
    
    @Get(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async findOne(@Param("id") id: string): Promise<Org> {
        return await this.orgService.findOne({ id });
    }
    
    @Post(`${urlBase}`)
    @Roles(Role.Admin)
    async createOrg(@Body() payload: Org, @Request() req: any): Promise<Org> {
        return await this.orgService.create(payload, req.user.id);
    }

    @Post(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async editOrgs(@Param("id") id: string, @Body() payload: Org): Promise<object> {
        return await this.orgService.edit(id, (payload as object));
    }

    @Delete(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async removeOrg(@Param("id") id: string): Promise<object> {
        return await this.orgService.remove(id);
    }
}
