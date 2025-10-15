import { inject, injectable } from 'tsyringe';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = new User({
      name: dto.name,
      email: dto.email,
    });

    return this.userRepository.create(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(
    id: string,
    dto: Partial<CreateUserDto>,
  ): Promise<User | null> {
    return this.userRepository.update(id, dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
