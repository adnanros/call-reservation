import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduler } from './scheduler.entity';
import { SchedulersRepository } from './schedulers.repository';
import { SchedulersService } from './schedulers.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Scheduler, SchedulersRepository]),
  ],
  providers: [SchedulersService],
})
export class SchedulersModule {}
