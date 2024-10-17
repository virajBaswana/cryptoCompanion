import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly mailService: MailerService) {}
  

  async sendMail() {
    const mailOptions = {
      from: 'alert@cryptocompanion.com',
    //   to : "hyperhire_assignment@hyperhire.in", 
      subject: "More than 3% price change in on hour !!!",
      text : "More than 3% price change in on hour !!! TAKE ACTION", 
    };

    try {
      const mail = await this.mailService.sendMail(mailOptions);
      console.log('Email sent: %s', mail);
      return mail;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  async sendMailForUserSetAlerts(to : string) {
    const mailOptions = {
      from: 'alert@cryptocompanion.com',
      to : to, 
      subject: "Alert Triggered",
      text : "Alert Triggered Take Action !!! TAKE ACTION", 
    };

    try {
      const mail = await this.mailService.sendMail(mailOptions);
      console.log('Email sent:asdfasfd %s', mail);
      return mail;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
