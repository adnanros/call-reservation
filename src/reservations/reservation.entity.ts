import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';

/**
 * This is a Reservation Model with {id:string, startTime: string, endTime: string,
 * email:string, phone: string, pushNotificationKey: string, receiveEmail: boolean,
 * receiveSmsNotification: string, receivePushNotification: string,
 * status: ReservationStatus, createdTime: string}
 */
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

  @Column()
  createdTime: string;
}
