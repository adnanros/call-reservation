/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')  
  id: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  pushNotificationKey: string;

  @Column()
  receiveEmail: boolean;

  @Column()
  receiveSmsNotification: boolean;

  @Column()
  receivePushNotification: boolean;

  @Column()
  status: ReservationStatus;
}
