import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  // ─── Master credentials from env (YOU manage these, not gyms) ───
  private readonly masterToken    = process.env.WHATSAPP_TOKEN;
  private readonly masterPhoneId  = process.env.WHATSAPP_PHONE_ID;

  // Monthly quota per plan
  private readonly QUOTAS: Record<string, number> = {
    free:    parseInt(process.env.QUOTA_FREE    || '200'),
    starter: parseInt(process.env.QUOTA_STARTER || '1000'),
    pro:     parseInt(process.env.QUOTA_PRO     || '5000'),
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Check & increment quota for a gym ───
  async checkAndConsumeQuota(gymId: string, count = 1): Promise<void> {
    const gym = await this.prisma.gymOwner.findUnique({ where: { id: gymId } });
    if (!gym) throw new ForbiddenException('Gym not found.');

    // Reset counter if new calendar month
    const now = new Date();
    const resetAt = new Date(gym.quotaResetAt);
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      await this.prisma.gymOwner.update({
        where: { id: gymId },
        data: { messageCount: 0, quotaResetAt: now },
      });
      gym.messageCount = 0;
    }

    const limit = this.QUOTAS[gym.plan] ?? this.QUOTAS.free;
    if (gym.messageCount + count > limit) {
      throw new ForbiddenException(
        `Monthly message quota exceeded (${gym.messageCount}/${limit}). Upgrade your plan to send more.`
      );
    }

    // Increment usage
    await this.prisma.gymOwner.update({
      where: { id: gymId },
      data: { messageCount: { increment: count } },
    });
  }

  // ─── Get quota info for a gym (for the Settings page) ───
  async getQuotaInfo(gymId: string) {
    const gym = await this.prisma.gymOwner.findUnique({ where: { id: gymId } });
    if (!gym) throw new ForbiddenException('Gym not found.');

    // Reset if new month
    const now = new Date();
    const resetAt = new Date(gym.quotaResetAt);
    let messageCount = gym.messageCount;
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      messageCount = 0;
    }

    const limit = this.QUOTAS[gym.plan] ?? this.QUOTAS.free;
    return {
      plan: gym.plan,
      used: messageCount,
      limit,
      remaining: Math.max(0, limit - messageCount),
      percentUsed: Math.round((messageCount / limit) * 100),
    };
  }

  // ─── Core send — always uses YOUR master credentials ───
  async sendMessage(to: string, messageBody: string): Promise<any> {
    if (!this.masterToken || !this.masterPhoneId || this.masterToken === 'YOUR_PERMANENT_ACCESS_TOKEN') {
      this.logger.warn(`[SIMULATION] Would send to ${to}: "${messageBody}"`);
      return { simulated: true, to, message: messageBody };
    }

    const url = `https://graph.facebook.com/v17.0/${this.masterPhoneId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: messageBody },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.masterToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send to ${to}`, error.response?.data || error.message);
      throw error;
    }
  }
}
