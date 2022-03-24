import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';

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
  async createReservationRequest(
    @Body() createReservationDto: CreateReservationRequestDto,
  ): Promise<Reservation> {
    return this.reservationsService.createReservationRequest(
      createReservationDto,
    );
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
