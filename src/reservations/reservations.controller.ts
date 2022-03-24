import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async getReservations(): Promise<Reservation[]> {
    return this.reservationsService.getReservations();
  }

  @Get('/:id')
  async getReservationById(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.getReservationById(id);
  }

  @Post()
  async reserveReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.reservationsService.reserveReservation(createReservationDto);
  }

  @Patch('/accept/:id')
  async acceptAReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.acceptAReservationByAdmin(id);
  }

  @Patch('/reject/:id')
  async rejectAReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.rejectAReservationByAdmin(id);
  }

  @Patch('/cancel/:id')
  async cancelAReservationByUser(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.cancelAReservationByUser(id);
  }
}
