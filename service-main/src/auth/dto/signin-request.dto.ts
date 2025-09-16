import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
