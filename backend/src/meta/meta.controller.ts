import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MetaService } from './meta.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('exchange-token')
  async exchangeToken(
    @Req() req: any,
    @Body('oauthData') oauthData: string
  ) {
    const userEmail = req.user.email; // Extracted from JWT
    return this.metaService.exchangeTokenAndFetchPhoneId(userEmail, oauthData);
  }
}
