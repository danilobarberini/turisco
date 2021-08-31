import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, Length } from 'class-validator';
import { CreateAgencyDto } from './create-agency.dto';

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  name: string;

  @Length(14, 14)
  readonly cnpj: string;

  @IsEmail()
  readonly email: string;

  @Length(8)
  password: string;
}
