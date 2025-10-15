import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import {
  CreateUserDto,
  createUserSchema,
} from '../../application/dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const dto = createUserSchema.parse(body);
    return this.userService.createUser(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get()
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
