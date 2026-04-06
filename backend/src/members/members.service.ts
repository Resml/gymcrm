import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(gymId: string) {
    const now = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(now.getDate() + 7);

    const total = await this.prisma.member.count({ where: { gymId } });

    // Active = latest membership endDate > now
    const activeMembers = await this.prisma.member.findMany({
      where: { gymId },
      include: { memberships: { orderBy: { endDate: 'desc' }, take: 1 } }
    });
    const active = activeMembers.filter(m => m.memberships[0] && new Date(m.memberships[0].endDate) > now).length;
    const expired = total - active;
    const expiringInWeek = activeMembers.filter(m => {
      const end = m.memberships[0] && new Date(m.memberships[0].endDate);
      return end && end > now && end <= sevenDays;
    }).length;

    return { total, active, expired, expiringInWeek };
  }


  async findAll(gymId: string) {
    return this.prisma.member.findMany({
      where: { gymId },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1
        }
      }
    });
  }

  async create(gymId: string, memberData: { name: string, phoneNumber: string, planMonths: number }) {
    // Basic calculation for membership expiry based on plan selection
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + memberData.planMonths);

    return this.prisma.member.create({
      data: {
        name: memberData.name,
        phoneNumber: memberData.phoneNumber,
        gym: { connect: { id: gymId } },
        memberships: {
          create: [{
            planName: `${memberData.planMonths} Months Plan`,
            startDate: new Date(),
            endDate: endDate
          }]
        }
      }
    });
  }

  async renew(gymId: string, memberId: string, planMonths: number) {
    const member = await this.prisma.member.findFirst({ where: { id: memberId, gymId } });
    if (!member) throw new NotFoundException('Member not found');
    
    // Add new membership record
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planMonths);

    return this.prisma.membership.create({
      data: {
        member: { connect: { id: memberId } },
        planName: `${planMonths} Months Renewal`,
        startDate: new Date(),
        endDate: endDate
      }
    });
  }

  async importBulk(gymId: string, membersList: Array<{ name: string, phone: string, date: string }>) {
    // Prisma SQLite doesn't optimally support nested createMany, so we use $transaction mapping
    const operations = membersList.map(m => {
      let parsedDate = new Date(m.date);
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date();
        parsedDate.setMonth(parsedDate.getMonth() + 1); // Default missing dates to 1 month
      }

      return this.prisma.member.create({
        data: {
          name: m.name,
          phoneNumber: m.phone,
          gym: { connect: { id: gymId } },
          memberships: {
            create: [{
              planName: 'Imported CSV Plan',
              startDate: new Date(),
              endDate: parsedDate
            }]
          }
        }
      });
    });

    return this.prisma.$transaction(operations);
  }
}
