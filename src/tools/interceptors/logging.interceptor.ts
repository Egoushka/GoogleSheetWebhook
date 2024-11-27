import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    this.logger.log(`Request: ${method} ${url}`);

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(
          `Response: ${method} ${url} - ${JSON.stringify(response)}`,
        );
      }),
    );
  }
}
