import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
// import { CronJob } from 'cron';

@Injectable()
export class SmsService {
  schedulerRegistry: SchedulerRegistry;
  constructor() {
    this.schedulerRegistry = new SchedulerRegistry();
  }
  private readonly logger = new Logger(SmsService.name);
  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('SEnding Sms');
    };
    const timeout = setTimeout(callback.bind(this), milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
