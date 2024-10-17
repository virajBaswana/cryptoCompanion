import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('decimal')
  usd_price: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  chain: string;
}
