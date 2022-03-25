import { EntityRepository, Repository } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { Logger } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { NotificationService } from './notification.service';
import { SmsService } from './sms.service';
@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  emailService: EmailsService;
  notificationService: NotificationService;
  smsService: SmsService;
  constructor() {
    super();
    this.emailService = new EmailsService();
    this.notificationService = new NotificationService();
    this.smsService = new SmsService();
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

    //emailTime is ten minutes before the Start-Time Reserved-Call
    const nowTime = Number(Date.now());
    const emailTime =
      Number(reservation.startTime) - nowTime - 10 * 60 * 60 * 1000;
    this.emailService.addTimeout('email' + reservation.id, emailTime);
    this.notificationService.addTimeout(
      'notiication' + reservation.id,
      emailTime - 50000,
    );
    this.smsService.addTimeout('sms' + reservation.id, emailTime - 9000);
    return reservation;
  }
}
