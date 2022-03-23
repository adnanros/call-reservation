import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import { CallsController } from './calls.controller';
import { CallsRepository } from './calls.repository';
import { CallsService } from './calls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Call, CallsRepository])],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
