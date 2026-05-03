/**
 * JWT from Socket.IO handshake: `auth.token` (raw or `Bearer <jwt>`) or
 * `Authorization` header. Used by `ChatGateway` and `SocketJwtGuard` so
 * connection-time verification matches guarded message handlers.
 */
export function extractJwtFromSocketHandshake(client: any): string | undefined {
  const authToken = client?.handshake?.auth?.token;
  if (typeof authToken === 'string' && authToken.trim()) {
    const parts = authToken.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') {
      return parts.slice(1).join(' ');
    }
    return parts[0];
  }

  const headerAuth = client?.handshake?.headers?.authorization;
  if (typeof headerAuth === 'string' && headerAuth.trim()) {
    const parts = headerAuth.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') {
      return parts.slice(1).join(' ');
    }
  }

  return undefined;
}
