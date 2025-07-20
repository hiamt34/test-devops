import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { parents, students } from 'drizzle/schemas';
import { DatabaseService } from 'src/modules/database';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService implements OnApplicationBootstrap {
  private logger = new Logger(StudentsService.name);
  private db: NodePgDatabase;
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    this.db = this.databaseService.getDrizzle();
  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      const [data] = await this.db
        .insert(students)
        .values(createStudentDto)
        .returning();

      return data;
    } catch (error) {
      this.logger.error('Error creating student:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findAll() {
    try {
      return await this.db
        .select({
          id: students.id,
          name: students.name,
          dob: students.dob,
          gender: students.gender,
          currentGrade: students.currentGrade,
          parent: {
            id: parents.id,
            name: parents.name,
            phone: parents.phone,
            email: parents.email,
          },
        })
        .from(students)
        .leftJoin(parents, eq(students.parentId, parents.id));
    } catch (error) {
      this.logger.error('Error finding student:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }

  async findOne(id: string) {
    try {
      const [student] = await this.db
        .select({
          id: students.id,
          name: students.name,
          dob: students.dob,
          gender: students.gender,
          currentGrade: students.currentGrade,
          parent: {
            id: parents.id,
            name: parents.name,
            phone: parents.phone,
            email: parents.email,
          },
        })
        .from(students)
        .leftJoin(parents, eq(students.parentId, parents.id))
        .where(eq(students.id, id));
      return student;
    } catch (error) {
      this.logger.error('Error finding student:', error);
      throw new BadRequestException('Request failed. Please try again.');
    }
  }
}
