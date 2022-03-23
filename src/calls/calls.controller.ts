import { Controller } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}
}
