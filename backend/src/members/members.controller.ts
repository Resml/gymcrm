import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('stats')
  getStats(@Req() req: any) {
    return this.membersService.getStats(req.user.gymId);
  }

  @Get()
  getMembers(@Req() req: any) {
    return this.membersService.findAll(req.user.gymId);
  }

  @Post()
  addMember(@Req() req: any, @Body() body: { name: string, phoneNumber: string, planMonths: string }) {
    return this.membersService.create(req.user.gymId, {
      name: body.name,
      phoneNumber: body.phoneNumber,
      planMonths: parseInt(body.planMonths)
    });
  }

  @Put(':id/renew')
  renewMember(@Req() req: any, @Param('id') id: string, @Body() body: { planMonths: string }) {
    return this.membersService.renew(req.user.gymId, id, parseInt(body.planMonths));
  }

  @Post('bulk')
  importBulkMembers(@Req() req: any, @Body('members') members: Array<{name: string, phone: string, date: string}>) {
    return this.membersService.importBulk(req.user.gymId, members);
  }
}
