import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  async exchangeTokenAndFetchPhoneId(userEmail: string, shortLivedConfigParameter: string) {
    this.logger.log(`Meta exchange disabled in SaaS mode. (Received for ${userEmail})`);
    return { success: true, message: 'Meta configuration handled centrally by platform.' };
  }
}
