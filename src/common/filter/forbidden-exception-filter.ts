import { ExceptionFilter, Catch, ArgumentsHost, ForbiddenException, Logger } from '@nestjs/common';

/**
 * Переопределение всех ForbiddenException
 */

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        Logger.log({
            statusCode: status,
            message: 'В доступе к ресурсу отказано',
            timestamp: new Date().toISOString(),
            path: request.url
        });

        response.status(status).json({ statusCode: status, message: 'В доступе к ресурсу отказано' });
    }
}