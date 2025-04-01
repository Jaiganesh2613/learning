import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Request to: ${context.switchToHttp().getRequest().url}`);
    const now = Date.now();
    return (
      next
        .handle()
        //chain multiple operators together
        .pipe(
          tap(() =>
            console.log(
              `Response sent from ${context.switchToHttp().getRequest().url} in ${
                Date.now() - now
              }ms`,
            ),
          ),
        )
    );
  }
}

//It allows you to perform side effects such as logging, debugging,
// or triggering additional actions without altering the actual data flow.
