import { EntityRepository, Repository } from 'typeorm';
import { Call } from './call.entity';
@EntityRepository(Call)
export class CallsRepository extends Repository<Call> {

}
