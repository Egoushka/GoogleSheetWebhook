import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    console.log(`Incoming Request - Method: ${method}, URL: ${url}`);

    return next.handle().pipe(
      tap((response) => {
        console.log(`Response for ${method} ${url} - Data:`, response);
      }),
    );
  }
}
