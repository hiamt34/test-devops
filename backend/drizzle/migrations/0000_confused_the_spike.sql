CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_registrations" (
	"class_id" varchar(10) NOT NULL,
	"student_id" varchar(10) NOT NULL,
	CONSTRAINT "class_registrations_class_student_unique" UNIQUE("class_id","student_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"subject" varchar(100) NOT NULL,
	"day_of_week" integer NOT NULL,
	"time_slot" varchar(50) NOT NULL,
	"teacher_name" varchar(255) NOT NULL,
	"max_students" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parents" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "parents_phone_unique" UNIQUE("phone"),
	CONSTRAINT "parents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" date NOT NULL,
	"gender" "gender" NOT NULL,
	"current_grade" integer,
	"parent_id" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"student_id" varchar(10) NOT NULL,
	"package_name" varchar(100) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_sessions" integer NOT NULL,
	"used_sessions" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_registrations" ADD CONSTRAINT "class_registrations_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_registrations" ADD CONSTRAINT "class_registrations_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "class_registrations_class_id_idx" ON "class_registrations" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "class_registrations_student_id_idx" ON "class_registrations" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "class_registrations_class_student_idx" ON "class_registrations" USING btree ("class_id","student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "classes_subject_idx" ON "classes" USING btree ("subject");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "classes_day_of_week_idx" ON "classes" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parents_email_idx" ON "parents" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parents_phone_idx" ON "parents" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "students_parent_id_idx" ON "students" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "students_name_idx" ON "students" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_student_id_idx" ON "subscriptions" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_start_date_idx" ON "subscriptions" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_end_date_idx" ON "subscriptions" USING btree ("end_date");