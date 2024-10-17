import { Inject, Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import {
  EvmChain,
  EvmErc20Price,
  EvmErc20PriceJSON,
} from '@moralisweb3/common-evm-utils';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class MoralisService {
  constructor(@Inject('MORALIS') private readonly moralis: typeof Moralis) {}
  // @Cron("*/1 * * * *")
  async getPrices(): Promise<EvmErc20PriceJSON[]> {
    try {
      const prices = await this.moralis.EvmApi.token.getMultipleTokenPrices(
        { chain: EvmChain.ETHEREUM },
        {
          tokens: [
            { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
            { tokenAddress: '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6' },
          ],
        },
      );
      // this.moralis.EvmApi.token.getTokenPrice()
      console.log('Cron fetched', prices.raw);
      const res = prices.toJSON();
      return res;
    } catch (error) {}
  }

  async getTokenPriceAnHourAgo(): Promise<
    {
      priceNow: number;
      priceOneHourAgo: number;
      tokenSymbol: string;
    }[]
  > {
    try {
      const tokenAddresses = [
        { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
        { tokenAddress: '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6' },
      ];

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600 * 1000);
      const blockResponse = await this.moralis.EvmApi.block.getDateToBlock({
        date: oneHourAgo.toISOString(),
        chain: EvmChain.ETHEREUM,
      });

      const oneHourAgoBlock = blockResponse.result.block;

      let priceInfo: {
        priceNow: number;
        priceOneHourAgo: number;
        tokenSymbol: string;
      }[] = [];

      await Promise.all(
        tokenAddresses.map(async (tokenAddress) => {
          const priceOneHourAgo = await this.moralis.EvmApi.token.getTokenPrice(
            {
              address: tokenAddress.tokenAddress,
              chain: EvmChain.ETHEREUM,
              toBlock: oneHourAgoBlock,
            },
          );
          const priceNow = await this.moralis.EvmApi.token.getTokenPrice({
            address: tokenAddress.tokenAddress,
            chain: EvmChain.ETHEREUM,
          });
          priceInfo.push({
            tokenSymbol: priceNow.toJSON().tokenSymbol,
            priceNow: priceNow.toJSON().usdPrice,
            priceOneHourAgo: priceOneHourAgo.toJSON().usdPrice,
          });
        }),
      );
      return priceInfo;
    } catch (error) {
      console.error('Error fetching token prices from an hour ago:', error);
      throw error;
    }
  }

  async getTokenPriceEveryHour() {
    try {
      const prices = [];
      const currentTime = Math.floor(Date.now() / 1000);
      const oneHour = 60 * 60;
      
      for (let i = 0; i <= 24; i++) {
        const timestamp = currentTime - i * oneHour;
        const block = await Moralis.EvmApi.block.getDateToBlock({
          date: new Date(timestamp * 1000),
          chain: EvmChain.ETHEREUM,
        });
        let priceInfo = await this.moralis.EvmApi.token.getMultipleTokenPrices(
          { chain: EvmChain.ETHEREUM },
          {
            tokens: [
              {
                tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                toBlock: block.toJSON().block.toString(),
              },
              {
                tokenAddress: '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6',
                toBlock: block.toJSON().block.toString(),
              },
            ],
          },
        );
        let priceJson = priceInfo.toJSON();
        console.log(priceInfo);
        let price = [
          {
            tokenSymbol: priceJson[0].tokenSymbol,
            price: priceJson[0].usdPrice,
          },
          {
            tokenSymbol: priceJson[1].tokenSymbol,
            price: priceJson[1].usdPrice,
          },
        ];
        console.log('price', price);

        prices.push({
          timestamp: new Date(timestamp * 1000),
          price: price,
        });
      }

      return prices;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getSwapRate(ethAmount: number) {
    try {
      let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

      let wbtcAddress = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';

      const prices = await this.moralis.EvmApi.token.getMultipleTokenPrices(
        { chain: EvmChain.ETHEREUM },
        {
          tokens: [
            { tokenAddress: wethAddress },
            { tokenAddress: wbtcAddress },
          ],
        },
      );
      const pricesJson = prices.toJSON();
      const ethToBtcSwapRate = pricesJson[0].usdPrice / pricesJson[1].usdPrice;
      const btc = ethAmount * ethToBtcSwapRate;
      const fees = 0.0003 * btc * pricesJson[1].usdPrice;
      return {
        ethToBtcSwapRate,
        wethPrice: pricesJson[0].usdPrice,
        wbtcPrice: pricesJson[1].usdPrice,
        btc,
        fees,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
