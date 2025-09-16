import {
    ExecutionContext,
    HttpException,
    Injectable
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new HttpException(
        {
          meta: {
            code: 401,
            message: err?.response?.message ?? 'Invalid token or token is expired',
          },
        },
        401,
      );
    }
    return user;
  }
}