import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { eq, sql, SQL, SQLWrapper } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseService } from 'src/modules/database';
import { classes, classRegistrations } from 'drizzle/schemas';

@Injectable()
export class ClassesService implements OnApplicationBootstrap {
  private logger = new Logger(ClassesService.name);
  private db: NodePgDatabase;
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    this.db = this.databaseService.getDrizzle();
  }

  async create(createClassDto: CreateClassDto) {
    try {
      const [data] = await this.db
        .insert(classes)
        .values(createClassDto)
        .returning();

      return data;
    } catch (error) {
      this.logger.error('Error creating class:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findByDay(dayOfWeek?: number) {
    try {
      const sql = this.db.select().from(classes);
      if (dayOfWeek) {
        return await sql.where(eq(classes.dayOfWeek, dayOfWeek));
      }
      return await sql;
    } catch (error) {
      this.logger.error('Error finding class:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findAll() {
    try {
      const query = sql`SELECT COUNT(*) AS count, class_id FROM class_registrations GROUP BY class_id;`;
      const [statistic, list] = await Promise.all([
        this.db.execute(query),
        this.db.select().from(classes),
      ]);
      return list.map((item) => ({
        ...item,
        registered:
          +statistic.rows.find((s) => s.class_id === item.id)?.count || 0,
      }));
    } catch (error) {
      this.logger.error('Error finding class:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }
}
