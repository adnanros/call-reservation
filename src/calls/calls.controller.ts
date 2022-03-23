import { Body, Controller, Post } from '@nestjs/common';
import { Call } from './call.entity';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';

@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Post()
  async reserveCall(@Body() createCallDto: CreateCallDto): Promise<Call> {
    return this.callsService.reserveCall(createCallDto);
  }
}
