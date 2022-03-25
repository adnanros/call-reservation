import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationsRepository)
    private reservationsRepository: ReservationsRepository,
  ) {}

  async getReservationsResponse(): Promise<Reservation[]> {
    return this.reservationsRepository.getReservationsResponse();
  }

  async getSingleReservationResponse(id: string): Promise<Reservation> {
    try {
      const reservation: Reservation =
        await this.reservationsRepository.findOne(id);
      return reservation;
    } catch (error) {
      throw new NotFoundException(
        'The reservation by Id: ' + id + ' does not exist',
      );
    }
  }

  async createReservationRequest(
    createReservationDto: CreateReservationRequestDto,
  ): Promise<Reservation> {
    return this.reservationsRepository.createReservationRequest(
      createReservationDto,
    );
  }

  /**
   1. At the first we should try fetch the target reservation to see if that it exists.
   2.Secondly, we have to take the previous state of the reservation, the acceptance
    should be applied for only the reservations which are in Requested state.

  */
  async acceptReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status === ReservationStatus.REQUESTED) {
      reservation.status = ReservationStatus.ACCEPTED;
      await this.reservationsRepository.save(reservation);
      console.log('emailTo(UserEmailAddress)');
      if (reservation.receiveEmail) {
        console.log(
          'setSheduleEventOnServer(emailTo(user' +
            reservation.email +
            ')) on reservation.startTime - 10min',
        );
      }
      if (reservation.receivePushNotification) {
        console.log(
          'setSheduleEventOnServer(emailTo(user' +
            reservation.email +
            ')) on reservation.startTime - 5min:',
        );
      }
      if (reservation.receiveSmsNotification) {
        console.log(
          'setSheduleEventOnServer(emailTo(user' +
            reservation.email +
            ')) on reservation.startTime - 1min:',
        );
      }

      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'Action is not allowed for this reservation',
      );
    }
  }

  /**
    Admin can reject any reservation except that reservations which are done already
 */
  async rejectReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status !== ReservationStatus.DONE) {
      reservation.status = ReservationStatus.REJECTED;
      await this.reservationsRepository.save(reservation);
      console.log('emailTo(UserEmailAddress)');
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'The target reservation is done already',
      );
    }
  }

  // User can only cancel the reservation that is in requested or accepted state

  async cancelReservationByUser(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (
      reservation.status === ReservationStatus.ACCEPTED ||
      reservation.status === ReservationStatus.REQUESTED
    ) {
      reservation.status = ReservationStatus.CANCELED;
      await this.reservationsRepository.save(reservation);
      console.log('emailTo(AdminEmailAddress)');
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'You are not allowed to change this reservation status',
      );
    }
  }

  async updateReservationTime(
    id: string,
    startTime: string,
  ): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (
      reservation.status !== ReservationStatus.DONE &&
      reservation.status !== ReservationStatus.ONGOING &&
      Number(startTime) > Date.now()
    ) {
      reservation.startTime = startTime;
      reservation.status = ReservationStatus.REQUESTED;
      await this.reservationsRepository.save(reservation);
      console.log('emailTo(AdminEmailAddress)');
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'You are not allowed to change this reservation status',
      );
    }
  }
}
