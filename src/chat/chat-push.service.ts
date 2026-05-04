import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { Parent } from 'schemas/parent.schema';
import { Doctor } from 'schemas/doctor.schema';

const MAX_FCM_TOKENS = 10;

@Injectable()
export class ChatPushService {
  private readonly log = new Logger(ChatPushService.name);
  private messaging: admin.messaging.Messaging | null = null;

  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (!raw) {
      this.log.warn('FCM disabled: set FIREBASE_SERVICE_ACCOUNT_JSON (service account JSON string).');
      return;
    }
    try {
      if (!admin.apps.length) {
        const cred = JSON.parse(raw) as admin.ServiceAccount;
        admin.initializeApp({
          credential: admin.credential.cert(cred as admin.ServiceAccount),
        });
      }
      this.messaging = admin.messaging();
    } catch (e) {
      this.log.warn(`FCM init failed: ${e}`);
    }
  }

  async registerToken(userId: string, role: string, token: string): Promise<void> {
    const t = token.trim();
    if (!t) return;
    const r = role.toLowerCase();
    if (r === 'parent') {
      const doc = await this.parentModel.findById(userId).select('fcmTokens').lean();
      const prev = ((doc as { fcmTokens?: string[] } | null)?.fcmTokens as string[] | undefined) ?? [];
      const next = [...new Set([t, ...prev])].slice(0, MAX_FCM_TOKENS);
      await this.parentModel.updateOne({ _id: userId }, { $set: { fcmTokens: next } });
    } else if (r === 'doctor') {
      const doc = await this.doctorModel.findById(userId).select('fcmTokens').lean();
      const prev = ((doc as { fcmTokens?: string[] } | null)?.fcmTokens as string[] | undefined) ?? [];
      const next = [...new Set([t, ...prev])].slice(0, MAX_FCM_TOKENS);
      await this.doctorModel.updateOne({ _id: userId }, { $set: { fcmTokens: next } });
    }
  }

  async notifyNewChatMessage(params: {
    preview: string;
    receiverId: string;
    receiverRole: 'parent' | 'doctor';
    data: Record<string, string>;
  }): Promise<void> {
    if (!this.messaging) return;

    let tokens: string[] = [];
    if (params.receiverRole === 'doctor') {
      const d = await this.doctorModel
        .findById(params.receiverId)
        .select('fcmTokens messageNotification doctorName')
        .lean();
      if (!d || (d as any).messageNotification === false) return;
      tokens = ((d as any).fcmTokens as string[] | undefined) ?? [];
    } else {
      const p = await this.parentModel
        .findById(params.receiverId)
        .select('fcmTokens messageNotification parentName')
        .lean();
      if (!p || (p as any).messageNotification === false) {
        return;
      }
      tokens = ((p as any).fcmTokens as string[] | undefined) ?? [];
    }

    if (!tokens.length) return;

    const title = 'New message';
    const body = params.preview.slice(0, 200);

    try {
      const res = await this.messaging.sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: params.data,
        android: { priority: 'high' },
        apns: {
          payload: {
            aps: { sound: 'default', badge: 1 },
          },
        },
      });
      if (res.failureCount > 0) {
        this.log.warn(`FCM partial failure: ${res.failureCount} / ${tokens.length}`);
      }
    } catch (e) {
      this.log.warn(`FCM send failed: ${e}`);
    }
  }
}
