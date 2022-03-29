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
export class ReservationsRepository extends Repository<Reservation> {
  schedulerService: SchedulersService;
  schedulersRepository: SchedulersRepository;

  constructor() {
    super();
    this.schedulersRepository = new SchedulersRepository();
    this.schedulerService = new SchedulersService(this.schedulersRepository);
  }
  private readonly logger = new Logger(ReservationsRepository.name);

  /**
   * This method is used to create a reservation in DataBase
   * @param createReservationDto This includes expected data types in reservation creation
   * @returns Promise<Reservation> This returns complete information of created reservation
   */
  async createReservationRequest(
    createReservationDto: CreateReservationRequestDto,
  ): Promise<Reservation> {
    const { startTime, endTime, email, phone } = createReservationDto;
    const reservation = this.create({
      startTime,
      endTime,
      email,
      phone,
      pushNotificationKey: 'someNotificationKey',
      receiveEmail: false,
      receiveSmsNotification: false,
      receivePushNotification: false,
      status: ReservationStatus.REQUESTED,
      createdTime: new Date().getTime().toString(),
    });

    await this.save(reservation);
    await this.schedulerService.setSchedulers(
      reservation.startTime,
      SchedulerType.EMAIL,
    );
    return reservation;
  }
}
