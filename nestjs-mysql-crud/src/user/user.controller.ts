import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns a list of all users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const cacheKey = 'allUsers';
    const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);

    if (cachedUsers) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedUsers;
    }

    const users = await this.userService.findAll();
    await this.cacheManager.set(cacheKey, users, 300000);
    return users;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    const cacheKey = `userID-${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedUser;
    }

    const user = await this.userService.findById(Number(id));
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, user, 300000);
    return user;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiBody({
    description: 'User update payload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    await this.cacheManager.del(`userID-${id}`);
    await this.cacheManager.del('allUsers');
    return this.userService.update(Number(id), updateData, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    await this.cacheManager.del(`userID-${id}`);
    await this.cacheManager.del('allUsers');
    return this.userService.delete(Number(id), req.user.id);
  }
}
