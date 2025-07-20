import { PgInsertValue } from 'drizzle-orm/pg-core';
import { classes, parents, students } from 'drizzle/schemas';
import { Gender } from 'src/enums/gender';

export const ParentsResource: PgInsertValue<typeof parents>[] = [
  {
    id: 'parent-1',
    name: 'Parent 1',
    phone: '0916922561',
    email: 'parent1@seeder.com',
  },
  {
    id: 'parent-2',
    name: 'Parent 2',
    phone: '0916922562',
    email: 'parent2@seeder.com',
  },
];

export const StudentsResource: PgInsertValue<typeof students>[] = [
  {
    id: 'student-1',
    name: 'Student 1',
    dob: '2000-01-01',
    gender: Gender.MALE,
    currentGrade: 1,
    parentId: 'parent-1',
  },
  {
    id: 'student-2',
    name: 'Student 2',
    dob: '2000-01-02',
    gender: Gender.FEMALE,
    currentGrade: 2,
    parentId: 'parent-2',
  },
  {
    id: 'student-3',
    name: 'Student 3',
    dob: '2000-01-03',
    gender: Gender.OTHER,
    currentGrade: 3,
    parentId: 'parent-1',
  },
];

export const ClassesResource: PgInsertValue<typeof classes>[] = [
  {
    id: 'class-1',
    name: 'Class 1',
    subject: 'Math',
    dayOfWeek: 1,
    timeSlot: '09:00-10:00',
    teacherName: 'Teacher 1',
    maxStudents: 10,
  },
  {
    id: 'class-2',
    name: 'Class 2',
    subject: 'Science',
    dayOfWeek: 2,
    timeSlot: '09:30-11:00',
    teacherName: 'Teacher 2',
    maxStudents: 10,
  },
  {
    id: 'class-3',
    name: 'Class 3',
    subject: 'English',
    dayOfWeek: 3,
    timeSlot: '10:00-12:00',
    teacherName: 'Teacher 3',
    maxStudents: 10,
  },
];
