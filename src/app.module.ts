import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { SchedulersModule } from './schedulers/schedulers.module';

@Module({
  imports: [
    ReservationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'call-reservation-db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SchedulersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
