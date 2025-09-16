import { Controller, Get, HttpCode, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/app/decorators/current-user.decorator';
import { mapError } from 'src/app/etc/utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  constructor(private readonly userService: UserService) {}

  @Get('profile/:username')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser('username') username: string) {
    this.logger.log(
      `[POST] /user/profile - username: ${username}`,
    );
    try {
      return await this.userService.getProfile(username);
    } catch (error) {
      mapError(error);
    }
  }
}
