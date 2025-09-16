import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProfileResponse } from 'src/auth/dto/profile-response.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(username: string): Promise<ProfileResponse> {
    this.logger.log(`Fetching profile for username: ${username}`);
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      this.logger.warn(`User with username ${username} not found`);
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      status: user.status,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
