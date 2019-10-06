import { Injectable } from '@angular/core';

import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { AdmobfreeService } from './admobfree.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  email = {
    to: 'rhslvkf@gamil.com',
    subject: '',
    body: '',
    isHtml: true
  }

  constructor(
    private emailComposer: EmailComposer,
    private admobFreeService: AdmobfreeService
  ) { }

  async sendEmail(subject: string, body: string) {
    this.email.subject = subject;
    this.email.body = body;
    await this.admobFreeService.removeBannerAd();
    await this.emailComposer.open(this.email);
    await this.admobFreeService.showBannerAd();
  }
}
