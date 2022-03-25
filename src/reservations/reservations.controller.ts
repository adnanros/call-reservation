import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async getReservationsResponse(): Promise<Reservation[]> {
    return this.reservationsService.getReservationsResponse();
  }

  @Get('/:id')
  async getSingleReservationResponse(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.getSingleReservationResponse(id);
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
  async acceptReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.acceptReservationByAdmin(id);
  }

  @Patch('/reject/:id')
  async rejectReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.rejectReservationByAdmin(id);
  }

  @Patch('/cancel/:id')
  async cancelReservationByUser(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.cancelReservationByUser(id);
  }

  @Patch('/changetime/:id')
  async updateReservationTime(
    @Param('id') id: string,
    @Body('startTime') startTime: string,
  ): Promise<Reservation> {
    return this.reservationsService.updateReservationTime(id, startTime);
  }
}
