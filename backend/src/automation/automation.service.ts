import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
  ) {}

  // Run automatically every day at 9:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyExpirations() {
    this.logger.debug('Running daily membership expiration check...');

    // Find all memberships that end in the next 3 days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const expiringMemberships = await this.prisma.membership.findMany({
      where: {
        endDate: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      include: {
        member: {
          include: {
            gym: true, // We would pull their configured Meta tokens from the Gym model in prod
          }
        }
      }
    });

    for (const sub of expiringMemberships) {
      if (!sub.member.phoneNumber) continue;
      
      const gym = sub.member.gym;

      const message = `Hey ${sub.member.name} 🏋️‍♂️\n\nJust a quick heads up - your Gym Membership expires on ${sub.endDate.toLocaleDateString()}. Renew today to lock in your current rate!`;
      
      try {
        await this.whatsappService.sendMessage(sub.member.phoneNumber, message);
        this.logger.log(`Dispatched expiration notice to ${sub.member.name} (${sub.member.phoneNumber}) via Gym ${gym.gymName}`);
      } catch (err) {
        this.logger.error(`Failed to dispatch notice to ${sub.member.name}: ${err.message}`);
      }
    }
  }
}
