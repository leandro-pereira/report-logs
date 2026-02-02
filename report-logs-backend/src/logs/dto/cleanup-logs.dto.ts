import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CleanupLogsDto {
  @ApiProperty({
    description: 'Número de dias para considerar logs como antigos',
    example: 30,
    minimum: 1,
    maximum: 365,
    default: 30,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'daysOld deve ser um número' })
  @Min(1, { message: 'daysOld deve ser no mínimo 1' })
  @Max(365, { message: 'daysOld pode ser no máximo 365' })
  daysOld?: number;
}
