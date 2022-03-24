import { IsNotEmpty } from 'class-validator';

export class CreateReservationRequestDto {
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;
}
