import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  unique,
  varchar,
  customType,
} from 'drizzle-orm/pg-core';
import { customAlphabet } from 'nanoid';

export const sub = customType<{
  data: string;
  config: { length?: number | undefined };
}>({
  dataType(config) {
    return config?.length ? `varchar(${config.length})` : 'varchar(10)';
  },
});

const random = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  10,
);

export const gender = pgEnum('gender', ['male', 'female', 'other']);

export const parents = pgTable(
  'parents',
  {
    id: sub('id')
      .primaryKey()
      .$defaultFn(() => random()),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
  },
  (table) => ({
    emailIdx: index('parents_email_idx').on(table.email),
    phoneIdx: index('parents_phone_idx').on(table.phone),
  }),
);

export const students = pgTable(
  'students',
  {
    id: sub('id')
      .primaryKey()
      .$defaultFn(() => random()),
    name: varchar('name', { length: 255 }).notNull(),
    dob: date('dob').notNull(),
    gender: gender('gender').notNull(),
    currentGrade: integer('current_grade'),
    parentId: sub('parent_id').references(() => parents.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    parentIdIdx: index('students_parent_id_idx').on(table.parentId),
    nameIdx: index('students_name_idx').on(table.name),
  }),
);

export const classes = pgTable(
  'classes',
  {
    id: sub('id')
      .primaryKey()
      .$defaultFn(() => random()),
    name: varchar('name', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 100 }).notNull(),
    dayOfWeek: integer('day_of_week').notNull(),
    timeSlot: varchar('time_slot', { length: 50 }).notNull(),
    teacherName: varchar('teacher_name', { length: 255 }).notNull(),
    maxStudents: integer('max_students').notNull(),
  },
  (table) => ({
    subjectIdx: index('classes_subject_idx').on(table.subject),
    dayOfWeekIdx: index('classes_day_of_week_idx').on(table.dayOfWeek),
  }),
);

export const classRegistrations = pgTable(
  'class_registrations',
  {
    classId: sub('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    studentId: sub('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    classIdIdx: index('class_registrations_class_id_idx').on(table.classId),
    studentIdIdx: index('class_registrations_student_id_idx').on(
      table.studentId,
    ),
    classStudentIdx: index('class_registrations_class_student_idx').on(
      table.classId,
      table.studentId,
    ),
    classStudentUnique: unique('class_registrations_class_student_unique').on(
      table.classId,
      table.studentId,
    ),
  }),
);

// Subscriptions table
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: sub('id')
      .primaryKey()
      .$defaultFn(() => random()),
    studentId: sub('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    packageName: varchar('package_name', { length: 100 }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    totalSessions: integer('total_sessions').notNull(),
    usedSessions: integer('used_sessions').notNull().default(0),
  },
  (table) => ({
    studentIdIdx: index('subscriptions_student_id_idx').on(table.studentId),
    startDateIdx: index('subscriptions_start_date_idx').on(table.startDate),
    endDateIdx: index('subscriptions_end_date_idx').on(table.endDate),
  }),
);

// Relations
export const parentsRelations = relations(parents, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  parent: one(parents, {
    fields: [students.parentId],
    references: [parents.id],
  }),
  classRegistrations: many(classRegistrations),
  subscriptions: many(subscriptions),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  classRegistrations: many(classRegistrations),
}));

export const classRegistrationsRelations = relations(
  classRegistrations,
  ({ one }) => ({
    class: one(classes, {
      fields: [classRegistrations.classId],
      references: [classes.id],
    }),
    student: one(students, {
      fields: [classRegistrations.studentId],
      references: [students.id],
    }),
  }),
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  student: one(students, {
    fields: [subscriptions.studentId],
    references: [students.id],
  }),
}));
