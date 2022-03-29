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
import { Email } from './email.service';

/**
 * This is Service to manage Reservation's tasks
 */
@Injectable()
export class ReservationsService {
  emailService: Email;
  constructor(
    @InjectRepository(ReservationsRepository)
    private reservationsRepository: ReservationsRepository,
  ) {
    this.emailService = new Email();
  }

  /**
   * This method is used to return all of Saved Reservations in DataBase
   * @return Promise<Reservation[]> This returns an array of Reserations
   */
  async getReservationsResponse(): Promise<Reservation[]> {
    const reservations: Reservation[] =
      await this.reservationsRepository.find();
    return reservations;
  }

  /**
   * This method is used to return reservation with a specific id
   * @param id This is an 'uuid'
   * @returns Promise<Reservation> this returns a single reservation
   */
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

  /**
   * This method is used to create a reservation with given information
   * @param createReservationDto This is an expected interface for the types of given information
   * @returns Promise<Reservation> This returns the created reservation information
   */
  async createReservationRequest(
    createReservationDto: CreateReservationRequestDto,
  ): Promise<Reservation> {
    return this.reservationsRepository.createReservationRequest(
      createReservationDto,
    );
  }

  /**
   * This method is used to update the status of the given reservation to Accepted by admin
   * @param id This is the id of target reservation
   * @returns Promise<Reservation> This returns the complete information of updated reservation
   */
  async acceptReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status === ReservationStatus.REQUESTED) {
      reservation.status = ReservationStatus.ACCEPTED;
      await this.reservationsRepository.save(reservation);
      this.emailService.sendTo(reservation.email);
      if (reservation.receiveEmail) {
        this.emailService.sendTo(reservation.email);
      }
      if (reservation.receivePushNotification) {
        this.emailService.sendTo(reservation.email);
      }
      

      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'Action is not allowed for this reservation',
      );
    }
  }

  /**
   * This method is used to update the status of the given reservation to REJECTED by admin
   * @param id This is the id of target reservation
   * @returns Promise<Reservation> This returns the complete information of updated reservation
   */
  async rejectReservationByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (reservation.status !== ReservationStatus.DONE) {
      reservation.status = ReservationStatus.REJECTED;
      await this.reservationsRepository.save(reservation);
      this.emailService.sendTo(reservation.email);
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'The target reservation is done already',
      );
    }
  }

  /**
   * This method is used to update the status of the given reservation to CANCELED by User
   * @param id This is the id of target reservation
   * @returns Promise<Reservation> This returns the complete information of updated reservation
   */
  async cancelReservationByUser(id: string): Promise<Reservation> {
    const reservation = await this.getSingleReservationResponse(id);
    if (
      reservation.status === ReservationStatus.ACCEPTED ||
      reservation.status === ReservationStatus.REQUESTED
    ) {
      reservation.status = ReservationStatus.CANCELED;
      await this.reservationsRepository.save(reservation);
      // We should Change this to Email of ADMIN
      this.emailService.sendTo(reservation.email);
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'You are not allowed to change this reservation status',
      );
    }
  }

  /**
   * This method is used to update the start time of a reservation
   * the new time should not be greater than NOW
   * @param id This is the id of target reservation
   * @param startTime This is a new start time
   * @returns Promise<Reservation> This returns the complete information of updated reservation
   */
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
      this.emailService.sendTo(reservation.email);
      return reservation;
    } else {
      throw new MethodNotAllowedException(
        'You are not allowed to change this reservation status',
      );
    }
  }
}
