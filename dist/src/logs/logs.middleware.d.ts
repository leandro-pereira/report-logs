import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogClient } from './log-client';
export declare class LogsMiddleware implements NestMiddleware {
    private readonly logClient;
    constructor(logClient: LogClient);
    use(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=logs.middleware.d.ts.map