import { injectable } from 'tsyringe';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../../domain/use-cases/users/create-user.use-case';
import { AuthenticateUserUseCase } from '../../domain/use-cases/users/authenticate-user.use-case';
import { GetUserByIdUseCase } from '../../domain/use-cases/users/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../../domain/use-cases/users/get-all-users.use-case';
import { UpdateUserUseCase } from '../../domain/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../domain/use-cases/users/delete-user.use-case';

@injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });
  }

  async authenticateUser(dto: LoginUserDto): Promise<User | null> {
    return this.authenticateUserUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.getUserByIdUseCase.execute(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.getAllUsersUseCase.execute();
  }

  async updateUser(
    id: string,
    dto: Partial<CreateUserDto>,
  ): Promise<User | null> {
    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.email) updateData.email = dto.email;
    if (dto.role) updateData.role = dto.role;
    if (dto.password) {
      updateData.password = dto.password; // Hashing will be handled in the use case
    }

    return this.updateUserUseCase.execute(id, updateData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.deleteUserUseCase.execute(id);
  }
}
