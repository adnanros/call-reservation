import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
// import { CronJob } from 'cron';

@Injectable()
export class NotificationService {
  schedulerRegistry: SchedulerRegistry;
  constructor() {
    this.schedulerRegistry = new SchedulerRegistry();
  }
  private readonly logger = new Logger(NotificationService.name);
  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('SEnding Notification');
    };
    const timeout = setTimeout(callback.bind(this), milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
