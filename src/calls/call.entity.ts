/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CallStatus } from './call-status.enum';
@Entity()
export class Call {
  @PrimaryGeneratedColumn('uuid')  
  id: string;
  @Column()
  description: string;
  @Column()
  callTime: string;
  @Column()
  status: CallStatus;
}
