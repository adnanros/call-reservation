import { EntityRepository, Repository } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { Logger } from '@nestjs/common';
import { SchedulersService } from 'src/schedulers/schedulers.service';
import { SchedulersRepository } from 'src/schedulers/schedulers.repository';
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

  async getReservationsResponse(): Promise<Reservation[]> {
    const reservations: Reservation[] = await this.find();
    return reservations;
  }

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
    await this.schedulerService.setSchedulers(reservation.startTime);
    return reservation;
  }
}
