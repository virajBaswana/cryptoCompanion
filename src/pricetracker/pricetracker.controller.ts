import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PricetrackerService } from './pricetracker.service';
import { MoralisService } from 'src/pricetracker/moralis.service';

@Controller('pricetracker')
export class PricetrackerController {
  constructor(
    private readonly pricetrackerService: PricetrackerService,
    private readonly moralisService: MoralisService,
  ) {}

  @Get('getPrices')
  async getPrices() {
    const prices = await this.pricetrackerService.pingForPrices();
    console.log(prices);
    return prices;
  }

  @Get('getPriceAnHourAgo')
  async gettokenpricesAnHourAgo() {
    const prices = await this.moralisService.getTokenPriceAnHourAgo();

    console.log(prices);
    return prices;
  }
  @Get('getPriceForEveryHour')
  async getPricesFor24Hours() {
    const prices = await this.pricetrackerService.getPricesFor24Hours();

    console.log(prices);
    return prices;
  }
  @Get('getSwapRate')
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    const prices = await this.pricetrackerService.getSwapRate(ethAmount);

    console.log(prices);
    return prices;
  }

  @Post('setAlert')
  async setAlert(
    @Query('email') email: string,
    @Query('usdPrice') usdPrice: number,
    @Query('chain') chain: 'WETH' | 'POL',
  ) {
    const setAlert = await this.pricetrackerService.setAlert(
      email,
      usdPrice,
      chain,
    );
    return setAlert;
  }
}
