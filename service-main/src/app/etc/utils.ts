import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  NotAcceptableException,
  InternalServerErrorException,
} from '@nestjs/common';

export function mapError(error: any): never {
  const statusCode = error.response?.statusCode ?? error.statusCode;

  if (statusCode === 400) {
    throw new BadRequestException(error.response?.message ?? error.message);
  }

  if (statusCode === 401) {
    throw new UnauthorizedException(
      error.response?.message ??
        'You are not authorized to access this resource',
    );
  }

  if (statusCode === 403) {
    throw new ForbiddenException(
      error.response?.message ?? 'You are forbidden to access this resource',
    );
  }

  if (statusCode === 404) {
    throw new NotFoundException(
      error.response?.message ?? 'Resource is not found',
    );
  }

  if (statusCode === 406) {
    throw new NotAcceptableException(
      error.response?.message ?? 'Not acceptable',
    );
  }

  throw new InternalServerErrorException(
    `Internal server error: ${error.message ?? error}`,
  );
}
