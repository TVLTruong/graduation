import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Accept password via header or query for simplicity
    const password =
      request.headers['x-admin-password'] || request.query.password;

    if (password && password === adminPassword) {
      return true;
    }

    throw new UnauthorizedException('Invalid admin password');
  }
}
