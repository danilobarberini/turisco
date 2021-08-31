import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, Length } from 'class-validator';

export class CreatePoiDto {
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

  @ApiProperty()
  @IsLatitude()
  lat: number;

  @ApiProperty()
  @IsLongitude()
  lng: number;

  @ApiPropertyOptional({ type: [String] })
  categories: string[];
}
