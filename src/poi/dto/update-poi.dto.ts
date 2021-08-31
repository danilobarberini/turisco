import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, Length } from 'class-validator';

export class UpdatePoiDto {
  @ApiProperty({
    description: 'single field',
    minLength: 3,
    maxLength: 100,
  })
  @Length(3, 100)
  name: string;

  @ApiProperty({
    minLength: 3,
    maxLength: 100,
  })
  @Length(3, 100)
  description: string;

  @ApiProperty({
    minLength: 3,
    maxLength: 100,
  })
  @Length(3, 100)
  address: string;

  @IsDecimal({ decimal_digits: '6' })
  lat: number;

  @IsDecimal({ decimal_digits: '6' })
  lng: number;

  @ApiPropertyOptional({ type: [String] })
  categories: string[];
}
