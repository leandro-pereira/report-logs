import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { CleanupLogsDto } from './dto/cleanup-logs.dto';
import { ApiKeyAuth } from '../api-key/api-key.middleware';

@ApiTags('Logs')
@Controller('logs')
@ApiBearerAuth()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um novo log',
    description:
      'Cria um novo registro de log no Firestore. Requer autenticação via API Key. Se o nível for ERROR, um email de alerta será enviado.',
  })
  @ApiBody({
    type: CreateLogDto,
    description: 'Dados do log a ser registrado',
    examples: {
      error: {
        summary: 'Log de erro',
        value: {
          message: 'Erro ao processar pagamento',
          level: 'ERROR',
          context: 'PaymentService',
          metadata: { orderId: '12345', amount: 100.50 },
        },
      },
      info: {
        summary: 'Log informativo',
        value: {
          message: 'Usuário fez login',
          level: 'INFO',
          context: 'AuthService',
          metadata: { userId: 'user_123' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Log criado com sucesso',
    schema: {
      example: {
        success: true,
        logId: 'log_abc123def456',
        message: 'Log registrado com sucesso',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'message',
            error: 'A mensagem é obrigatória',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'API Key inválida ou não fornecida',
    schema: {
      example: {
        success: false,
        message: 'Unauthorized',
      },
    },
  })
  async createLog(@Body() createLogDto: CreateLogDto, @ApiKeyAuth() apiKey: any, @Req() req: any) {
    // Capturar informações da requisição se disponíveis
    const requestContext = req.requestContext || {};

    const logId = await this.logsService.createLog(createLogDto, apiKey, requestContext);
    return {
      success: true,
      logId,
      message: 'Log registrado com sucesso',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os logs',
    description: 'Recupera os logs mais recentes. Pode limitar o número de resultados.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de logs a retornar (padrão: 100, máximo: 1000)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs recuperada com sucesso',
    schema: {
      example: {
        success: true,
        count: 5,
        logs: [
          {
            id: 'log_abc123',
            message: 'Erro ao processar',
            level: 'ERROR',
            context: 'PaymentService',
            createdAt: '2026-02-01T10:30:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'API Key inválida',
  })
  async getAllLogs(@Query('limit') limit?: string) {
    const logs = await this.logsService.getAllLogs(
      limit ? parseInt(limit, 10) : 100,
    );
    return {
      success: true,
      count: logs.length,
      logs,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um log específico',
    description: 'Recupera os detalhes de um log pelo seu ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do log',
    example: 'log_abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Log encontrado',
    schema: {
      example: {
        success: true,
        log: {
          id: 'log_abc123',
          message: 'Erro ao processar',
          level: 'ERROR',
          context: 'PaymentService',
          metadata: { orderId: '12345' },
          createdAt: '2026-02-01T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Log não encontrado',
    schema: {
      example: {
        success: false,
        message: 'Log não encontrado',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'API Key inválida',
  })
  async getLogById(@Param('id') id: string) {
    const log = await this.logsService.getLogById(id);
    if (!log) {
      return {
        success: false,
        message: 'Log não encontrado',
      };
    }
    return {
      success: true,
      log,
    };
  }

  @Post('cleanup')
  @ApiOperation({
    summary: 'Limpar logs antigos',
    description:
      'Remove todos os logs mais antigos que o número de dias especificado. Envia email de confirmação.',
  })
  @ApiBody({
    type: CleanupLogsDto,
    description: 'Parâmetros de limpeza',
    examples: {
      thirtyDays: {
        summary: 'Remover logs com 30+ dias',
        value: { daysOld: 30 },
      },
      custom: {
        summary: 'Remover logs com 60+ dias',
        value: { daysOld: 60 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Limpeza realizada com sucesso',
    schema: {
      example: {
        success: true,
        deletedCount: 25,
        message: '25 logs antigos foram removidos',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'API Key inválida',
  })
  async cleanupOldLogs(@Body() cleanupDto: CleanupLogsDto) {
    const deleted = await this.logsService.cleanupOldLogs(cleanupDto.daysOld || 30);
    return {
      success: true,
      deletedCount: deleted,
      message: `${deleted} logs antigos foram removidos`,
    };
  }

  @Post('report/send')
  @ApiOperation({
    summary: 'Enviar relatório de logs por email',
    description:
      'Gera e envia um relatório com os últimos logs para o email configurado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório enviado com sucesso',
    schema: {
      example: {
        success: true,
        message: 'Relatório enviado com sucesso',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Falha ao enviar relatório',
    schema: {
      example: {
        success: false,
        message: 'Falha ao enviar relatório',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'API Key inválida',
  })
  async sendDailyReport() {
    const sent = await this.logsService.sendDailyReport();
    return {
      success: sent,
      message: sent ? 'Relatório enviado com sucesso' : 'Falha ao enviar relatório',
    };
  }
}
