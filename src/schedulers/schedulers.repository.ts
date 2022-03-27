import { EntityRepository, Repository } from 'typeorm';
import { Scheduler } from './scheduler.entity';
@EntityRepository(Scheduler)
export class SchedulersRepository extends Repository<Scheduler> {}
