import { Injectable } from '@angular/core';

import { EmailComposer } from '@ionic-native/email-composer/ngx';

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

  constructor(private emailComposer: EmailComposer) { }

  sendEmail(subject: string, body: string) {
    this.email.subject = subject;
    this.email.body = body;
    this.emailComposer.open(this.email);
  }
}
