import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [ScheduleModule.forRoot(), LogsModule],
  providers: [ScheduleService],
})
export class AppScheduleModule {}
