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

  async getReservations(): Promise<Reservation[]> {
    return this.reservationsRepository.getReservations();
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
  async acceptAReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status === ReservationStatus.REQUESTED) {
      reservation.status = ReservationStatus.ACCEPTED;
      await this.reservationsRepository.save(reservation);
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
  async rejectAReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status !== ReservationStatus.DONE) {
      reservation.status = ReservationStatus.REJECTED;
      await this.reservationsRepository.save(reservation);
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'The target reservation is done already',
      );
    }
  }

  // User can only cancel the reservation that is in requested or accepted state

  async cancelAReservationByUser(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (
      reservation.status === ReservationStatus.ACCEPTED ||
      reservation.status === ReservationStatus.REQUESTED
    ) {
      reservation.status = ReservationStatus.CANCELED;
      await this.reservationsRepository.save(reservation);
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'You are not allowed to change this reservation status',
      );
    }
  }
}
