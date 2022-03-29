import { IsNotEmpty } from 'class-validator';

/**
 * This is DTO to check data types in reservation creation process
 * This incudes {@IsNotEmpty()startTime: string, @IsNotEmpty()endTime: string,
 * @IsNotEmpty()email: string, @IsNotEmpty()phone: string}
 */
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
