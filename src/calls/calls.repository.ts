import { EntityRepository, Repository } from 'typeorm';
import { CallStatus } from './call-status.enum';
import { Call } from './call.entity';
import { CreateCallDto } from './dto/create-call.dto';
@EntityRepository(Call)
export class CallsRepository extends Repository<Call> {
  async reserveCall(createCallDto: CreateCallDto): Promise<Call> {
    const { description, callTime } = createCallDto;
    const call = this.create({
      description,
      callTime,
      status: CallStatus.REQUESTED,
    });
    await this.save(call);
    return call;
  }
}
