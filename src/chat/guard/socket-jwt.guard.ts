import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: any = context.switchToWs().getClient();
    if (client?.data?.user) {
      return true;
    }
    const token = this.extractToken(client);
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

  private extractToken(client: any): string | undefined {
    const authToken = client?.handshake?.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      const parts = authToken.trim().split(' ');
      // handles both "Bearer eyJ..." and raw "eyJ..."
      return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : parts[0];
    }
  
    const headerAuth = client?.handshake?.headers?.authorization;
    if (typeof headerAuth === 'string' && headerAuth.trim()) {
      const [type, token] = headerAuth.split(' ');
      if (type === 'Bearer' && token) return token;
    }
  
    return undefined;
  }
 }

