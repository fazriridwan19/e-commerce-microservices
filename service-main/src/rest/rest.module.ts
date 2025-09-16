import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RestService } from './rest.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('AXIOS_TIMEOUT') ?? 5000,
        maxRedirects: configService.get<number>('AXIOS_MAX_REDIRECTS') ?? 5,
      }),
    }),
  ],
  exports: [HttpModule],
  providers: [RestService],
})
export class RestModule {}
