import { ReservationStatus } from '../reservation-status.enum';

export class GetSingleReservationResponse {
  id: string;
  startTime: string;
  email: string;
  phone: string;
  pushNotificationKey: string;
  endTime: string;
  status: ReservationStatus;
  createdTime: string;
}
