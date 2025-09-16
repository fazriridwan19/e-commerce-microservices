import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { SignUpRequest } from './dto/signup-request.dto';
import { ProfileResponse } from './dto/profile-response.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInRequest } from './dto/signin-request.dto';
import { SignInResponse } from './dto/signin-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(request: SignUpRequest): Promise<ProfileResponse> {
    const isExists = await this.userRepo.exists({
      where: [{ email: request.email }, { username: request.username }],
    });

    if (isExists) {
      throw new NotAcceptableException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const user = await this.userRepo.save({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      username: request.username,
      password: hashedPassword,
      status: 'ACTIVE',
      roles: 'USER',
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async signIn(request: SignInRequest): Promise<SignInResponse> {
    const user = await this.userRepo.findOne({
      where: { username: request.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotAcceptableException('Invalid username or password');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, username: user.username, roles: user.roles },
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRATION'),
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username, roles: user.roles },
      {
        expiresIn: this.configService.getOrThrow<string>(
          'REFRESH_JWT_EXPIRATION',
        ),
        secret: this.configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(payload: {userId: string, username: string, roles: string}): Promise<SignInResponse> {
    if (!payload?.userId || !payload?.username) {
      throw new NotFoundException('payload is not valid');
    }

    const accessToken = this.jwtService.sign(
      { sub: payload.userId, username: payload.username, roles: payload.roles },
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRATION'),
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );

    return { accessToken, refreshToken: '' };
  }
}
