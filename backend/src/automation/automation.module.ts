import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, WhatsappModule],
  providers: [AutomationService],
})
export class AutomationModule {}
