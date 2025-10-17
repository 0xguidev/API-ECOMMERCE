import { inject, injectable } from 'tsyringe';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';

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

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      isTwoFactorEnabled: false,
    });

    return this.userRepository.create(user);
  }

  async authenticateUser(dto: LoginUserDto): Promise<User | null> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
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
    const updateData: Partial<User> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.email) updateData.email = dto.email;
    if (dto.role) updateData.role = dto.role;
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
