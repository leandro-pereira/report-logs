import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'MeuApp' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
