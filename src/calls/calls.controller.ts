import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { Call } from './call.entity';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';

@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Get()
  async getCalls(): Promise<Call[]> {
    return this.callsService.getCalls();
  }
  @Post()
  async reserveCall(@Body() createCallDto: CreateCallDto): Promise<Call> {
    return this.callsService.reserveCall(createCallDto);
  }

  @Patch('/accept/:id')
  async acceptACallByAdmin(@Param('id') id: string): Promise<UpdateResult> {
    return this.callsService.acceptACallByAdmin(id);
  }

  @Patch('/reject/:id')
  async rejectACallByAdmin(@Param('id') id: string): Promise<UpdateResult> {
    return this.callsService.rejectACallByAdmin(id);
  }
}
