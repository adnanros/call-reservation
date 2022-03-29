import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';

/**
 * This is a controller to handle reservation API's
 * Its API's are shaped with '/reservations'
 */
@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  /**
   * This method is called with Get(/reservations) API to return
   * all of existed reservation
   * This method calls a method with the same name in ReservationService
   * @returns Promise<Reservation[] This returns an array of reservations
   */
  @Get()
  async getReservationsResponse(): Promise<Reservation[]> {
    return this.reservationsService.getReservationsResponse();
  }

  /**
   * This method is called with Get(/reservations/@param id) API
   * This method calls a method with the same name in ReservationService
   * @param id This is an id with 'uuid' format
   * @returns Promise<Reservation> This returns a specific reservation with given id
   */
  @Get('/:id')
  async getSingleReservationResponse(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.getSingleReservationResponse(id);
  }

  /**
   * This method is called with Post(/reservations) API
   * This method calls a method with the same name in ReservationService
   * @param createReservationDto This is a expected interface to check of
   *  information types of the reservation that is going to be created
   * @returns Promise<Reservation> This returns the complete information
   *  about created reservation
   */
  @Post()
  async createReservationRequest(
    @Body() createReservationDto: CreateReservationRequestDto,
  ): Promise<Reservation> {
    return this.reservationsService.createReservationRequest(
      createReservationDto,
    );
  }

  /**
   * This method is called with Patch(/reservations/accept/@param id) API
   * This method calls a method with the same name in ReservationService
   * @param id This is an id with 'uuid' format
   * @returns Promise<Reservation> This returns the complete information
   *  about updated reservation
   */
  @Patch('/accept/:id')
  async acceptReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.acceptReservationByAdmin(id);
  }

  /**
   * This method is called with Patch(/reservations/reject/@param id) API
   * This method calls a method with the same name in ReservationService
   * @param id This is an id with 'uuid' format
   * @returns Promise<Reservation> This returns the complete information
   *  about updated reservation
   */
  @Patch('/reject/:id')
  async rejectReservationByAdmin(
    @Param('id') id: string,
  ): Promise<Reservation> {
    return this.reservationsService.rejectReservationByAdmin(id);
  }

  /**
   * This method is called with Patch(/reservations/cancel/@param id) API
   * This method calls a method with the same name in ReservationService
   * @param id This is an id with 'uuid' format
   * @returns Promise<Reservation> This returns the complete information
   *  about updated reservation
   */
  @Patch('/cancel/:id')
  async cancelReservationByUser(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.cancelReservationByUser(id);
  }

  /**
   * This method is called with Patch(/reservations/changetime/@param id) API
   * This method calls a method with the same name in ReservationService
   * @param id This is an id with 'uuid' format
   * @returns Promise<Reservation> This returns the complete information
   *  about updated reservation
   */
  @Patch('/changetime/:id')
  async updateReservationTime(
    @Param('id') id: string,
    @Body('startTime') startTime: string,
  ): Promise<Reservation> {
    return this.reservationsService.updateReservationTime(id, startTime);
  }
}
