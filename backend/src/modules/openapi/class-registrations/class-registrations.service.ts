import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { and, count, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseService } from 'src/modules/database';
import { RegisterStudentDto } from './dto/register-student.dto';
import { classes, classRegistrations } from 'drizzle/schemas';
import { convertTimeSlotToRange } from 'src/utils/time-helper';

@Injectable()
export class ClassRegistrationsService implements OnApplicationBootstrap {
  private logger = new Logger(ClassRegistrationsService.name);
  private db: NodePgDatabase;
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    this.db = this.databaseService.getDrizzle();
  }

  async register(classId: string, registerStudentDto: RegisterStudentDto) {
    try {
      const { studentId } = registerStudentDto;
      const [targetClass] = await this.db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (!targetClass) {
        throw new BadRequestException('Class not found');
      }

      const registed = await this.db
        .select({
          classId: classes.id,
          timeSlot: classes.timeSlot,
        })
        .from(classRegistrations)
        .innerJoin(classes, eq(classRegistrations.classId, classes.id))
        .where(
          and(
            eq(classRegistrations.studentId, studentId),
            eq(classes.dayOfWeek, targetClass.dayOfWeek),
          ),
        );

      if (registed.find((r) => r.classId === targetClass.id)) {
        throw new BadRequestException('Student already registered this class');
      }

      const [targetStart, targetEnd] = convertTimeSlotToRange(
        targetClass.timeSlot,
      );
      const isConflict = registed.some((r) => {
        const [start, end] = convertTimeSlotToRange(r.timeSlot);
        return !(targetEnd <= start || targetStart >= end);
      });

      if (isConflict) {
        throw new BadRequestException('Time slot conflict');
      }

      await this.db.transaction(async (tx) => {
        await tx.insert(classRegistrations).values({ classId, studentId });
        const [data] = await tx
          .select({ count: count() })
          .from(classRegistrations)
          .where(eq(classRegistrations.classId, classId));
        if (data.count > targetClass.maxStudents) {
          throw new BadRequestException('Class is full');
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error registering student:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }
}
