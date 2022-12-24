import { RolesGuard } from '../../infra/role.guard';
import { Roles } from '../../infra/role.decorators';
import { Role } from '../../infra/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CategoryGame } from './CategoryGame.entity';
import { CategoryGameService } from './CategoryGame.service';
const urlBase = '/CategoryGame';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryGameController {
  constructor(private readonly CategoryGameService: CategoryGameService) {}

  @Get(`${urlBase}`)
  @Roles(Role.Admin)
  async findAllCategoryGames(): Promise<CategoryGame[]> {
    return await this.CategoryGameService.findAll();
  }

  @Get(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string): Promise<CategoryGame> {
    return await this.CategoryGameService.findOne({ id });
  }

  @Post(`${urlBase}`)
  @Roles(Role.Admin)
  async createCategoryGame(
    @Body() payload: CategoryGame,
    @Request() req: any,
  ): Promise<CategoryGame> {
    return await this.CategoryGameService.create(payload, req.user?.id);
  }

  @Post(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async editCategoryGames(
    @Param('id') id: string,
    @Body() payload: CategoryGame,
  ): Promise<any> {
    return await this.CategoryGameService.edit(id, payload as any);
  }

  @Delete(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async removeCategoryGame(@Param('id') id: string): Promise<any> {
    return await this.CategoryGameService.remove(id);
  }
}
