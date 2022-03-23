import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CallsRepository } from './calls.repository';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(CallsRepository)
    private callsRepository: CallsRepository,
  ) {}
}
