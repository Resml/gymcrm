import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { AuthModule } from './auth/auth.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { PrismaModule } from './prisma/prisma.module';
import { AutomationModule } from './automation/automation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MetaModule } from './meta/meta.module';

@Module({
  imports: [
    MembersModule, 
    AuthModule, 
    WhatsappModule, 
    PrismaModule, 
    AutomationModule,
    ScheduleModule.forRoot(),
    MetaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
