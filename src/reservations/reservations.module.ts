import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from 'src/emails/emails.module';
import { EmailsService } from './emails.service';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationsRepository]),
    EmailsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, EmailsService],
})
export class ReservationsModule {}
