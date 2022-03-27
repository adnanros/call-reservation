import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerType } from './scheduler-type.enum';
import { Scheduler } from './scheduler.entity';
import { SchedulersRepository } from './schedulers.repository';

@Injectable()
export class SchedulersService {
  schedulerRegistry: SchedulerRegistry;
  constructor(
    //Getting rid of Nest error: Have no Repository Or Not registered in Connection
    @InjectRepository(SchedulersRepository)
    private schedulersRepository: SchedulersRepository,
  ) {
    this.schedulerRegistry = new SchedulerRegistry();

    //Restoring Timeouts from DataBase and setting or eliminating passed time
    this.rescheduleTasks();
  }

  //In Service Restarting
  async rescheduleTasks() {
    //load only pendings
    const allSchedulers = await Scheduler.find({
      pendding: true,
    });
    allSchedulers.forEach((item) => {
      if (Number(item.triggerTime) <= Date.now()) {
        //Eliminate those timoout that their timout passed
        item.pendding = false;
        item.save();
      } else {
        //Rescheduling those timoout that their timout not passed
        const emailTimeout = Number(item.triggerTime) - Date.now();
        this.addTimeout(item.id, emailTimeout, item.type);
      }
    });
  }

  //Store and Set of Timeouts When a Reservation is accepted
  async setSchedulers(time: string): Promise<void> {
    const triggerTime = Number(time) - 10 * 60 * 1000;
    const emailTimeout = triggerTime - Date.now();
    //store timeout info in DataBase
    const scheduled = await this.storeScheduler(
      triggerTime,
      SchedulerType.EMAIL,
    );
    //Set timeout on running server
    this.addTimeout(scheduled.id, emailTimeout, SchedulerType.EMAIL);
  }

  //storing in DataBase
  async storeScheduler(time: number, type: SchedulerType): Promise<Scheduler> {
    const scheduled = new Scheduler();
    scheduled.triggerTime = time.toString();
    scheduled.type = type;
    scheduled.pendding = true;
    await scheduled.save();
    return scheduled;
  }

  //Setting TimeOUT
  addTimeout(name: string, milliseconds: number, schedulerType: SchedulerType) {
    const callback = async () => {
      //Actions to be done when timeout is fired
      console.log('Sending' + schedulerType);

      //load the scheduled email from database and set it's pending state to false.
      const scheduled = await Scheduler.findOne({
        id: name,
      });
      scheduled.pendding = false;
      scheduled.save();
    }; //End of Actions to be fired

    //Set the Duo-Time of Timeout
    const timeout = setTimeout(callback.bind(this), milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
