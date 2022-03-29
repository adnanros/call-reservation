import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerType } from './scheduler-type.enum';
import { Scheduler } from './scheduler.entity';
import { SchedulersRepository } from './schedulers.repository';

/**
 * This is a service that is responsible for addressing scheduled Jobs or Timeouts
 */
@Injectable()
export class SchedulersService {
  schedulerRegistry: SchedulerRegistry;
  constructor(
    // Getting rid of Nest error: Have no Repository Or Not registered in Connection
    @InjectRepository(SchedulersRepository)
    private schedulersRepository: SchedulersRepository,
  ) {
    this.schedulerRegistry = new SchedulerRegistry();

    // Restoring Timeouts from DataBase and setting or eliminating passed time
    this.rescheduleTasks();
  }

  /**
   * This method is used to make the service stateless
   * This is called on startup to restoring the unfired Timeouts
   */
  async rescheduleTasks() {
    // load only pendings Timeouts
    const allSchedulers = await Scheduler.find({
      pending: true,
    });
    allSchedulers.forEach((item) => {
      if (Number(item.triggerTime) <= Date.now()) {
        // Eliminate those jobs that their timouts have been passed
        item.pending = false;
        item.save();
      } else {
        // Rescheduling those timoout that their timout not passed
        const emailTimeout = Number(item.triggerTime) - Date.now();
        this.addTimeout(item.id, emailTimeout, item.type);
      }
    });
  }

  /**
   * This method is used to store and set of Timeouts when a Reservation is accepted
   * @param time This is the start time of reservation
   */
  async setSchedulers(
    time: string,
    schedulerType: SchedulerType,
  ): Promise<void> {
    const triggerTime = Number(time) - 10 * 60 * 1000;
    const emailTimeout = triggerTime - Date.now();
    // storing the Timeout information in DataBase
    const scheduled = await this.storeScheduler(triggerTime, schedulerType);
    // Set a Timeout on running server
    this.addTimeout(scheduled.id, emailTimeout, SchedulerType.EMAIL);
  }

  /**
   * This method is used to store a scheduled Job or Timeout in database
   * @param time This is the trigger time of the scheduled Job or Timeout
   * @param type This is the type of job and used to recreate the exact job
   * @returns Promise<Scheduler> This is the complete information stored
   * about the scheduled job
   */
  async storeScheduler(time: number, type: SchedulerType): Promise<Scheduler> {
    const scheduled = new Scheduler();
    scheduled.triggerTime = time.toString();
    scheduled.type = type;
    scheduled.pending = true;
    await scheduled.save();
    return scheduled;
  }

  /**
   * This method is used to set the specific job or timout on the server
   * @param name This is the unique name of the job
   * @param milliseconds This is the time remaining to fire the Timeout
   * @param schedulerType This is the type of job that to be done on firing
   */
  addTimeout(name: string, milliseconds: number, schedulerType: SchedulerType) {
    const callback = async () => {
      // Actions to be done when the Timeout is fired
      console.log('Sending' + schedulerType);

      // Loading the scheduled email from database and set it's pending state to false.
      const scheduled = await Scheduler.findOne({
        id: name,
      });
      scheduled.pending = false;
      scheduled.save();
    }; // End of Actions to be done

    // Setting the Duo-Time of the Timeout
    const timeout = setTimeout(callback.bind(this), milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
