import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SchedulerType } from './scheduler-type.enum';

@Entity()
export class Scheduler extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  triggerTime: string;
  @Column()
  type: SchedulerType;
  @Column()
  pendding: boolean;
}
