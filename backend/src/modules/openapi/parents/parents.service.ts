import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { count, eq, or } from 'drizzle-orm';
import { DatabaseService } from 'src/modules/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { parents } from 'drizzle/schemas';

@Injectable()
export class ParentsService implements OnApplicationBootstrap {
  private logger = new Logger(ParentsService.name);
  private db: NodePgDatabase;
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    this.db = this.databaseService.getDrizzle();
  }

  async create(createParentDto: CreateParentDto) {
    try {
      //todo: check phone/email đã tồn tại
      const existed = await this.db
        .select({ count: count() })
        .from(parents)
        .where(
          or(
            eq(parents.phone, createParentDto.phone),
            eq(parents.email, createParentDto.email),
          ),
        );
      if (existed[0].count > 0) {
        throw new BadRequestException('Phone/Email already exists.');
      }
      const [data] = await this.db
        .insert(parents)
        .values(createParentDto)
        .returning();
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating parent:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findAll() {
    try {
      return await this.db.select().from(parents);
    } catch (error) {
      this.logger.error('Error finding parent:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findOne(id: string) {
    try {
      const [parent] = await this.db
        .select()
        .from(parents)
        .where(eq(parents.id, id));
      return parent;
    } catch (error) {
      this.logger.error('Error finding parent:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }
}
