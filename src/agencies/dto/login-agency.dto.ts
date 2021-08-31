import { IsEmail, Length } from 'class-validator';

export class LoginAgencyDto {
  @IsEmail()
  readonly email: string;

  @Length(8)
  password: string;
}
