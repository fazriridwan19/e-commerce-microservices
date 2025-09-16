import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly excludePaths: string[] = [],
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const defaultMessageResponse = {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      203: 'NonAuthoritativeInfo',
      204: 'NoContent',
      205: 'ResetContent',
      206: 'PartialContent',
    };

    const result = await firstValueFrom(
      next.handle().pipe(
        catchError((error) => {
          const statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;

          const message =
            error.response?.message ?? error.message ?? 'Internal Server Error';

          return throwError(
            () =>
              new HttpException(
                {
                  meta: {
                    code: statusCode,
                    message: message,
                  },
                },
                statusCode,
              ),
          );
        }),
      ),
    );

    if (result instanceof StreamableFile) {
      return of(result);
    }

    if (result === undefined) {
      return of({ message: null });
    }

    const request = context.switchToHttp().getRequest<Request>();
    if (this.excludePaths.includes(request.url)) {
      return of(result);
    }

    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) ||
      (request.method === 'POST' ? 201 : 200);

    let messageResponse: string | null =
      defaultMessageResponse[status] !== undefined
        ? defaultMessageResponse[status]
        : null;

    if (result.messageResponse !== undefined) {
      messageResponse = result.messageResponse;
      delete result.messageResponse;
    }

    let metaBody;
    if (result.pagination !== undefined) {
      metaBody = {
        code: status,
        message: messageResponse,
        totalData: result.pagination.totalData,
        totalPage: result.pagination.totalPage,
        limit: result.pagination.limit,
        offset: result.pagination.offset,
      };
      delete result.pagination;
    } else if (result.totalData !== undefined) {
      metaBody = {
        code: status,
        message: messageResponse,
        totalData: result.totalData,
      };
      delete result.totalData;
    } else {
      metaBody = {
        code: status,
        message: messageResponse,
      };
    }

    return of({
      meta: metaBody,
      data: result.data !== undefined ? result.data : result,
    });
  }
}
