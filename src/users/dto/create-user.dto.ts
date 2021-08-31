import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @Length(6)
  readonly username: string;

  @IsNotEmpty()
  @Length(8)
  password: string;
}
