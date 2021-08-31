import { IsEmail, Length } from 'class-validator';

export class CreateAgencyDto {
  readonly name: string;

  @Length(14, 14)
  readonly cnpj: string;

  @IsEmail()
  readonly email: string;

  @Length(8)
  password: string;
}
