import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulersModule } from 'src/schedulers/schedulers.module';
import { Email } from './email.service';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationsRepository]),
    SchedulersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, Email],
})
export class ReservationsModule {}
