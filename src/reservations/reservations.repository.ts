import { EntityRepository, Repository } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { EmailsService } from './emails.service';
@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  constructor(private schedulerRegistry: SchedulerRegistry) {
    super();
  }
  private readonly emailSchedulingService: EmailsService;
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

    //emailTime is ten minutes before the Start-Time Reserved-Call
    const nowTime = Number(Date.now());
    const emailTime =
      Number(reservation.startTime) - nowTime - 10 * 60 * 60 * 1000;
    this.emailTimeout('email', emailTime);

    //SmS time
    const smsTime = emailTime - 5 * 60 * 60 * 1000;
    this.smsTimeout('sms', smsTime);

    //notification time
    const notificationTime =
      Number(reservation.startTime) - nowTime - 1 * 60 * 60 * 1000;
    this.notificationTimeout('sms', notificationTime);

    return reservation;
  }

  //Time-out functions to set time out and define a trigger event
  emailTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('Sending Email');
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
  smsTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('Sending SmS');
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
  notificationTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('Sending Notification');
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
