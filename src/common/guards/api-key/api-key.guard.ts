import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

      if (isPublic) {
        observer.next(true);
        observer.complete();
      }

      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const authHeader = request.header('Authorization');

      observer.next(authHeader === this.configService.get('app.api.key'));
      observer.complete();
    });
  }
}
