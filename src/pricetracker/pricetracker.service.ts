import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/pricetracker.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { MoralisService } from './moralis.service';
import { MailService } from './mail.service';
import { Alert } from './entities/alert.entity';

@Injectable()
export class PricetrackerService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @Inject() private readonly moralisService: MoralisService,
    @Inject() private readonly mailService: MailService,
  ) {}

  @Cron('*/5 * * * *')
  async pingForPrices() {
    try {
      console.info("Cron job querying for current prices every 5 minutes")
      const pricesData = await this.moralisService.getPrices();
      const requiredData = pricesData.map((priceData) => {
        let res: Partial<Price> = {
          usd_price: priceData.usdPrice,
          token_name: priceData.tokenName,
          token_symbol: priceData.tokenSymbol,
        };
        return res;
      });

      // match current prices with alerts set by user
      const alerts = await this.alertRepository.find()
      console.log(alerts)

      for(let i = 0 ; i < alerts.length ; i++) {
        requiredData.forEach(async (data) => {
          console.log("sending email")
          if(alerts[i].usd_price <= data.usd_price && alerts[i].chain === data.token_symbol){
            await this.mailService.sendMailForUserSetAlerts(alerts[i].email)
          }
        })
      }

      let finalData = this.priceRepository.create(requiredData);
      let saveData = await this.priceRepository.save(finalData);
      return saveData;
    } catch (error) {
      console.log(error);
    }
  }

  @Cron('0 * * * *')
  async comparePricesOneHourAgo() {
    try {
      console.info("Cron job querying for current prices every hour")
      const priceInfo = await this.moralisService.getTokenPriceAnHourAgo();
      console.log(priceInfo);
      priceInfo.forEach(async (element) => {
        let change =
          ((element.priceNow - element.priceOneHourAgo) * 100) /
          element.priceOneHourAgo;

        if (change >= 3) {
          console.log('sending email');
          await this.mailService.sendMail();
          console.log('email sent');
          return;
        } else {
          console.log('no email sent');
          return;
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPricesFor24Hours() {
    try {
      const prices = await this.moralisService.getTokenPriceEveryHour();
      console.log(prices);
      return prices;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getSwapRate(ethAmount: number) {
    try {
      const prices = await this.moralisService.getSwapRate(ethAmount);
      console.log(prices);
      return prices;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async setAlert(email: string, usdPrice: number, chain: string) {
    try {
      const alert = this.alertRepository.create({
        usd_price: usdPrice,
        email: email,
        chain: chain,
      });

      const saveAlert = await this.alertRepository.insert(alert)
      return saveAlert.identifiers
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
