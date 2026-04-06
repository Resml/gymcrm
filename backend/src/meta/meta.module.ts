import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MetaService, PrismaService],
  controllers: [MetaController]
})
export class MetaModule {}
