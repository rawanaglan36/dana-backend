// src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
// import { AuthService } from './auth.service';
import { ParentService } from '../parent.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private parentService: ParentService,
    config: ConfigService,
  ) {
    const options: StrategyOptions = {
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK')!,
      scope: ['email', 'profile'],
      // passReqToCallback:false,
    };
    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const token = await this.parentService.validateGoogleUser(profile);
      done(null, token);
    } catch (err) {
      done(err);
    }
  }
}
