// redis.module.ts
import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: process.env.REDIS_MODULE || 'redis://localhost:6379',
          socket: {
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                console.log('Redis connection failed after 10 retries. Running without Redis.');
                return false; // Stop reconnecting
              }
              return Math.min(retries * 100, 3000);
            }
          }
        });

        client.on('error', (err) => console.error('Redis Client Error', err));

        try {
          await client.connect();
          console.log(' Redis connected successfully');
        } catch (error) {
          console.warn(' Redis connection failed. App will run without Redis caching.');
          console.warn('To enable Redis, please start Redis server on port 6379');
        }

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
