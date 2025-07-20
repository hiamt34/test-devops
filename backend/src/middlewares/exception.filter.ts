import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as Filter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ExceptionFilter implements Filter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const err = exception.getResponse() as any;

    response.status(status).json({
      statusCode: status,
      message:
        typeof err === 'string' ? err : (err.message ?? err.error ?? 'unknown'),
      data: err.data ?? {},
    });
  }
}
