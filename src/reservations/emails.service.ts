import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
// import { CronJob } from 'cron';

@Injectable()
export class EmailsService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger(EmailsService.name);
  // addCronJob(name: string, time: string) {
  //   const job = new CronJob(time, () => {
  //     this.logger.warn(`time dddd!`);
  //   });

  //   this.schedulerRegistry.addCronJob(name, job);
  //   job.start();
  // }
  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log('SEnding Email');
    };
    const timeout = setTimeout(callback.bind(this), milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
