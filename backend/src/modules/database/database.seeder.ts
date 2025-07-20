import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { classes, parents, students } from 'drizzle/schemas';
import { DatabaseService } from './database.service';
import {
  ClassesResource,
  ParentsResource,
  StudentsResource,
} from './seeder.resource';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);
  constructor(private readonly databaseService: DatabaseService) {}
  async onApplicationBootstrap() {
    const node = this.databaseService.getDrizzle();

    await node.insert(parents).values(ParentsResource).onConflictDoNothing();

    await node.insert(students).values(StudentsResource).onConflictDoNothing();

    await node.insert(classes).values(ClassesResource).onConflictDoNothing();

    this.logger.log('Database seeded');
  }
}
