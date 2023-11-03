import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

/**
 * Перехватчик - показать время выполнения методов в контроллере
 */

const criticalTime = 10000;

@Injectable()
export class LoggingTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      Logger.log(`Controller: ${context.getClass().name} Method: ${context.getHandler().name} - Before`);

      const now = Date.now();
      return next.handle().pipe(
        tap(() => {
          const runTime = Date.now() - now;
          Logger.log(
            `Controller: ${context.getClass().name} Method: ${context.getHandler().name} - After ${runTime}ms`
          );
          if (runTime > criticalTime) {
            Logger.warn(`Warning: Слишком большое время работы контроллера, ${runTime} больше ${criticalTime}`);
          }
        })
      );
  }
}