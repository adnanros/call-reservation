/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')  
  id: string;
  @Column()
  description: string;
  @Column()
  reservationTime: string;
  @Column()
  status: ReservationStatus;
}
