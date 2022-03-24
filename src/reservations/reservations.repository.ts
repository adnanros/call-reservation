import { EntityRepository, Repository } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  async getReservations(): Promise<Reservation[]> {
    const reservations: Reservation[] = await this.find();
    return reservations;
  }

  async reserveReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { description, reservationTime } = createReservationDto;
    const reservation = this.create({
      description,
      reservationTime,
      status: ReservationStatus.REQUESTED,
    });
    await this.save(reservation);
    return reservation;
  }
}
