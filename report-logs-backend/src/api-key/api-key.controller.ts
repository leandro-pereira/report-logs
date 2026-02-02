import { Controller, Post, Body, HttpCode, HttpStatus, Req, Headers } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API Keys')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar ou atualizar API Key',
    description:
      'Cria uma nova chave API para a aplicação. Se a chave já existe (autenticação fornecida), uma NOVA chave será gerada (rotação de segurança). A chave antiga será desativada automaticamente. A autenticação é OPCIONAL na primeira chamada.',
  })
  @ApiBody({
    type: CreateApiKeyDto,
  })
  @ApiCreatedResponse({
    description: 'Chave criada ou retornada com sucesso',
    schema: {
      example: {
        success: true,
        message: 'Chave API criada com sucesso',
        data: {
          id: 'key_1706789123456_abc123def',
          name: 'MeuApp',
          key: 'pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          secret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
          createdAt: '2026-02-01T10:30:00.000Z',
          expiryDate: '2026-03-03T10:30:00.000Z',
          note: '⚠️  Guarde a chave e secret em local seguro. Você não poderá recuperá-los depois.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  createOrUpdateApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Headers('authorization') authHeader?: string,
  ) {
    // Se houver autenticação no header, validar credenciais (renovação)
    if (authHeader) {
      const credentials = authHeader.replace('Bearer ', '');
      const [apiKey, apiSecret] = credentials.split(':');

      if (apiKey && apiSecret) {
        try {
          // Validar as credenciais fornecidas
          this.apiKeyService.validateApiKey(apiKey, apiSecret);
        } catch (error) {
          throw error;
        }
      }
    }

    const apiKey = this.apiKeyService.createOrUpdateApiKey(createApiKeyDto.name);

    return {
      success: true,
      message: 'Chave API criada com sucesso',
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key,
        secret: apiKey.secret,
        createdAt: apiKey.createdAt,
        expiryDate: apiKey.expiryDate,
        note: '⚠️  Guarde a chave e secret em local seguro. Você não poderá recuperá-los depois.',
      },
    };
  }
}
