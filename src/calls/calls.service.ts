import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { CallStatus } from './call-status.enum';
import { Call } from './call.entity';
import { CallsRepository } from './calls.repository';
import { CreateCallDto } from './dto/create-call.dto';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(CallsRepository)
    private callsRepository: CallsRepository,
  ) {}

  async getCalls(): Promise<Call[]> {
    return this.callsRepository.getCalls();
  }

  async getCallById(id: string): Promise<Call> {
    try {
      const call: Call = await this.callsRepository.findOne(id);
      return call;
    } catch (error) {
      throw new NotFoundException('The call by Id: ' + id + ' does not exist');
    }
  }

  async reserveCall(createCallDto: CreateCallDto): Promise<Call> {
    return this.callsRepository.reserveCall(createCallDto);
  }

  /**
   1. At the first we should try fetch the target call to see if that it exists.
   2.Secondly, we have to take the previous state of the call, the acceptance
    should be applied for only the calls which are in Requested state.

  */
  async acceptACallByAdmin(id: string): Promise<Call> {
    const call = await this.getCallById(id);
    if (call.status === CallStatus.REQUESTED) {
      call.status = CallStatus.ACCEPTED;
      await this.callsRepository.save(call);
      return call;
    } else {
      throw new MethodNotAllowedException(
        'Action is not allowed for this call',
      );
    }
  }

  async rejectACallByAdmin(id: string): Promise<UpdateResult> {
    const result = await this.callsRepository.update(id, {
      status: CallStatus.REJECTED,
    });
    return result;
  }

  async cancelACallByAdmin(id: string): Promise<UpdateResult> {
    const result = await this.callsRepository.update(id, {
      status: CallStatus.CANCELED,
    });
    return result;
  }
}
