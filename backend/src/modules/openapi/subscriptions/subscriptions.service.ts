import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseService } from 'src/modules/database';
import { subscriptions } from 'drizzle/schemas';

@Injectable()
export class SubscriptionsService implements OnApplicationBootstrap {
  private logger = new Logger(SubscriptionsService.name);
  private db: NodePgDatabase;
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    this.db = this.databaseService.getDrizzle();
  }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const [data] = await this.db
        .insert(subscriptions)
        .values(createSubscriptionDto)
        .returning();

      return data;
    } catch (error) {
      this.logger.error('Error creating subscription:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async useSession(id: string) {
    try {
      const [subscription] = await this.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));

      if (!subscription) {
        throw new BadRequestException(`Subscription not found`);
      }

      if (subscription.usedSessions >= subscription.totalSessions) {
        throw new BadRequestException('No sessions left');
      }

      await this.db.transaction(async (tx) => {
        const [updatedSubscription] = await tx
          .update(subscriptions)
          .set({ usedSessions: sql`used_sessions + 1` })
          .where(eq(subscriptions.id, id))
          .returning();
        if (
          updatedSubscription.usedSessions >= updatedSubscription.totalSessions
        ) {
          throw new BadRequestException('No sessions left');
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error using session:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findAll() {
    try {
      return await this.db.select().from(subscriptions);
    } catch (error) {
      this.logger.error('Error finding subscription:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findOne(id: string) {
    try {
      const [subscription] = await this.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));
      return subscription;
    } catch (error) {
      this.logger.error('Error finding subscription:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }
}
