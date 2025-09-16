import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/app/decorators/current-user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { mapError } from '../app/etc/utils';
import { SignInRequest } from './dto/signin-request.dto';
import { SignUpRequest } from './dto/signup-request.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() request: SignUpRequest) {
    this.logger.log(
      `[POST] /auth/signup - request: ${JSON.stringify(request)}`,
    );
    try {
      return await this.authService.signUp(request);
    } catch (error) {
      mapError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() request: SignInRequest) {
    this.logger.log(
      `[POST] /auth/signin - request: ${JSON.stringify(request)}`,
    );
    try {
      return await this.authService.signIn(request);
    } catch (error) {
      mapError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@CurrentUser() payload: { userId: string, username: string, roles: string }) {
    this.logger.log(`[POST] /auth/refresh-token`);
    try {
      return await this.authService.refreshToken(payload);
    } catch (error) {
      mapError(error);
    }
  }
}
