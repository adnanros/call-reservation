import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
