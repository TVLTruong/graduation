import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { password: string }) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (body.password === adminPassword) {
      // In a real app we'd return a JWT, but for simplicity here we just confirm it's correct
      // The frontend can store this password in localStorage and send it in headers
      return { success: true, token: body.password };
    }
    throw new UnauthorizedException('Invalid password');
  }
}
