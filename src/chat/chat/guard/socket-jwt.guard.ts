import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { extractJwtFromSocketHandshake } from '../utils/extract-socket-jwt';

@Injectable()
export class SocketJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: any = context.switchToWs().getClient();
    if (client?.data?.user) {
      return true;
    }
    const token = extractJwtFromSocketHandshake(client);
    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.user = payload;
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}

