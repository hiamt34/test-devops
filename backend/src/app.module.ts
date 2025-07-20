import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/database';
import { DatabaseModule } from './modules/database';
import { ParentsModule } from './modules/openapi/parents/parents.module';
import { StudentsModule } from './modules/openapi/students/students.module';
import { ClassesModule } from './modules/openapi/classes/classes.module';
import { ClassRegistrationsModule } from './modules/openapi/class-registrations/class-registrations.module';
import { SubscriptionsModule } from './modules/openapi/subscriptions/subscriptions.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    DatabaseModule.forRoot(),
    ParentsModule,
    StudentsModule,
    ClassesModule,
    ClassRegistrationsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
