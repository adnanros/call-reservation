import { EntityRepository, Repository } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { Logger } from '@nestjs/common';
import { SchedulersService } from '../schedulers/schedulers.service';
import { SchedulersRepository } from '../schedulers/schedulers.repository';
import { SchedulerType } from '../schedulers/scheduler-type.enum';
/**
 * This is a Repository for Reservation Model
 */
@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {}
