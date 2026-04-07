import { Controller, Post, Get, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('api/whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly prisma: PrismaService
  ) {}

  // ─── Normalize Indian phone numbers to international format ───
  private normalizePhone(phone: string): string {
    let p = phone.replace(/[\s\-\(\)\+]/g, '');
    if (p.length === 10) p = '91' + p;           // bare 10-digit → add 91
    if (p.startsWith('0')) p = '91' + p.slice(1); // 0xxxxxxxxxx → 91xxxxxxxxx
    return p;
  }

  @Get('quota')
  async getQuota(@Req() req: any) {
    return this.whatsappService.getQuotaInfo(req.user.gymId);
  }

  @Post('broadcast')
  async broadcastMessage(
    @Req() req: any,
    @Body() body: { target: string; message: string }
  ) {
    const gymId = req.user.gymId;

    let recipients: string[] = [];
    const activeMembers = await this.prisma.member.findMany({
      where: { gymId },
      include: { memberships: { orderBy: { endDate: 'desc' }, take: 1 } }
    });
    const now = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(now.getDate() + 7);

    if (body.target === 'all') {
      recipients = activeMembers
        .filter(m => m.memberships[0] && new Date(m.memberships[0].endDate) > now)
        .map(m => this.normalizePhone(m.phoneNumber));
    } else if (body.target === 'expiring') {
      recipients = activeMembers
        .filter(m => {
          const end = m.memberships[0] && new Date(m.memberships[0].endDate);
          return end && end > now && end <= sevenDays;
        })
        .map(m => this.normalizePhone(m.phoneNumber));
    }

    if (recipients.length === 0) {
      return { success: true, dispatched: 0, details: [] };
    }

    try {
      await this.whatsappService.checkAndConsumeQuota(gymId, recipients.length);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }

    const results: any[] = [];
    for (const phone of recipients) {
      try {
        const res = await this.whatsappService.sendMessage(phone, body.message);
        results.push({ phone, status: 'sent', data: res });
      } catch (err) {
        results.push({ phone, status: 'failed', error: err.message });
      }
    }

    return { success: true, dispatched: results.filter(r => r.status === 'sent').length, details: results };
  }

  @Post('send-manual')
  async sendManual(
    @Req() req: any,
    @Body() body: { memberIds: string[]; message: string }
  ) {
    const gymId = req.user.gymId;

    const members = await this.prisma.member.findMany({
      where: { id: { in: body.memberIds }, gymId }
    });

    if (members.length === 0) {
      return { success: true, sent: 0, failed: 0, details: [] };
    }

    try {
      await this.whatsappService.checkAndConsumeQuota(gymId, members.length);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }

    const results: any[] = [];
    for (const member of members) {
      try {
        const phone = this.normalizePhone(member.phoneNumber);
        const res = await this.whatsappService.sendMessage(phone, body.message);
        results.push({ name: member.name, phone, status: 'sent', data: res });
      } catch (err) {
        results.push({ name: member.name, phone: member.phoneNumber, status: 'failed', error: err.message });
      }
    }

    return {
      success: true,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      details: results
    };
  }
}
