/**
 * Standard API envelope for chat Socket.IO events. Serialized JSON uses a
 * `data` field so the Flutter [ChatSocketClient] can read `response['data']`.
 */
export class responseDto<T = unknown> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data: T,
  ) {}
}
