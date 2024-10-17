import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/pricetracker.entity';
import { PricetrackerController } from './pricetracker.controller';
import { PricetrackerService } from './pricetracker.service';
import { MoralisService } from './moralis.service';
import Moralis from 'moralis';
import { MailService } from './mail.service';
import { Alert } from './entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Alert])],
  controllers: [PricetrackerController],
  providers: [
    PricetrackerService,
    MoralisService,
    MailService,
    {
      provide: 'MORALIS',
      useFactory: async () => {
        // Initialize Moralis with the API key
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        });
        return Moralis;
      },
    },
  ],
})
export class PricetrackerModule {}
