import { Injectable } from '@nestjs/common';
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

  async reserveCall(createCallDto: CreateCallDto): Promise<Call> {
    return this.callsRepository.reserveCall(createCallDto);
  }

  async acceptACallByAdmin(id: string): Promise<UpdateResult> {
    const result = await this.callsRepository.update(id, {
      status: CallStatus.ACCEPTED,
    });
    return result;
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
