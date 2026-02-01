import { IsString, IsOptional, IsNotEmpty, IsEnum, MinLength, MaxLength, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export class CreateLogDto {
  @ApiProperty({
    description: 'ID único da requisição para rastrear múltiplos logs relacionados',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'O requestId deve ser um UUID válido (v4)' })
  requestId?: string;

  @ApiProperty({
    description: 'Mensagem do log',
    example: 'Erro ao processar pagamento',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @IsString({ message: 'A mensagem deve ser uma string' })
  @MinLength(1, { message: 'A mensagem não pode estar vazia' })
  @MaxLength(500, { message: 'A mensagem pode ter no máximo 500 caracteres' })
  message: string;

  @ApiProperty({
    description: 'Nível do log',
    example: 'ERROR',
    enum: LogLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(LogLevel, { message: 'O nível deve ser INFO, WARN, ERROR ou DEBUG' })
  level?: LogLevel;

  @ApiProperty({
    description: 'Contexto ou serviço que gerou o log',
    example: 'PaymentService',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'O contexto deve ser uma string' })
  @MaxLength(100, { message: 'O contexto pode ter no máximo 100 caracteres' })
  context?: string;

  @ApiProperty({
    description: 'Dados adicionais em formato JSON',
    example: { orderId: '12345', amount: 100.50, currency: 'BRL' },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'A metadata deve ser um objeto' })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Stack trace do erro',
    example: 'Error: Payment failed\n    at processPayment (payment.service.ts:45:15)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O stack deve ser uma string' })
  stack?: string;

  @ApiProperty({
    description: 'Ambiente de onde o log foi gerado',
    example: 'production',
    required: false,
    maxLength: 50,
    enum: ['development', 'staging', 'production'],
  })
  @IsOptional()
  @IsString({ message: 'O ambiente deve ser uma string' })
  @MaxLength(50, { message: 'O ambiente pode ter no máximo 50 caracteres' })
  ambient?: string;

  @ApiProperty({
    description: 'Caminho da requisição (path)',
    example: '/api/users/123',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'O path deve ser uma string' })
  @MaxLength(255, { message: 'O path pode ter no máximo 255 caracteres' })
  path?: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
    required: false,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  })
  @IsOptional()
  @IsString({ message: 'O method deve ser uma string' })
  method?: string;

  @ApiProperty({
    description: 'User-Agent do navegador/cliente',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'O userAgent deve ser uma string' })
  @MaxLength(500, { message: 'O userAgent pode ter no máximo 500 caracteres' })
  userAgent?: string;

  @ApiProperty({
    description: 'Código de status HTTP da resposta',
    example: 200,
    required: false,
    minimum: 100,
    maximum: 599,
  })
  @IsOptional()
  statusCode?: number;

  @ApiProperty({
    description: 'Identificação do usuário/aplicação autenticada que fez a requisição',
    example: 'key_1706789123456_abc123def',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'O authenticatedBy deve ser uma string' })
  @MaxLength(255, { message: 'O authenticatedBy pode ter no máximo 255 caracteres' })
  authenticatedBy?: string;

  @ApiProperty({
    description: 'Tempo de resposta do endpoint em milissegundos',
    example: 245,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  responseTime?: number;

  @ApiProperty({
    description: 'Mensagem de erro ou informações adicionais do endpoint',
    example: 'Database connection timeout',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'O errorMessage deve ser uma string' })
  @MaxLength(500, { message: 'O errorMessage pode ter no máximo 500 caracteres' })
  errorMessage?: string;
}
