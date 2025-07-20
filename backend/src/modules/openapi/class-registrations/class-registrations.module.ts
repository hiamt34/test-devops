import { Module } from '@nestjs/common';
import { ClassRegistrationsService } from './class-registrations.service';
import { ClassRegistrationsController } from './class-registrations.controller';

@Module({
  controllers: [ClassRegistrationsController],
  providers: [ClassRegistrationsService],
})
export class ClassRegistrationsModule {}
