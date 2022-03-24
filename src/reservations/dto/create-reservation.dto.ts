import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  reservationTime: string;
}
