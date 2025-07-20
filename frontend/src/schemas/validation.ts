import { z } from "zod";

// Custom time slot validation
const timeSlotRegex =
  /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])-([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

const validateTimeSlot = (timeSlot: string) => {
  if (!timeSlotRegex.test(timeSlot)) {
    return false;
  }

  const [startTime, endTime] = timeSlot.split("-");
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  // End time must be after start time
  if (endTotalMinutes <= startTotalMinutes) {
    return false;
  }

  // Minimum duration should be 30 minutes
  if (endTotalMinutes - startTotalMinutes < 30) {
    return false;
  }

  return true;
};

// Class validation schema
export const classSchema = z.object({
  className: z
    .string()
    .min(1, "Tên lớp là bắt buộc")
    .max(50, "Tên lớp không được quá 50 ký tự"),
  subject: z
    .string()
    .min(1, "Môn học là bắt buộc")
    .max(30, "Môn học không được quá 30 ký tự"),
  dayOfWeek: z.string().min(1, "Ngày trong tuần là bắt buộc"),
  timeSlot: z
    .string()
    .min(1, "Khung giờ là bắt buộc")
    .refine(validateTimeSlot, {
      message:
        "Khung giờ không hợp lệ. Giờ kết thúc phải sau giờ bắt đầu ít nhất 30 phút",
    }),
  teacher: z
    .string()
    .min(1, "Tên giáo viên là bắt buộc")
    .max(50, "Tên giáo viên không được quá 50 ký tự"),
  maxStudents: z
    .number()
    .min(1, "Số học sinh phải ít nhất là 1")
    .max(50, "Số học sinh không được quá 50")
    .int("Số học sinh phải là số nguyên"),
});

// Parent validation schema
export const parentSchema = z.object({
  name: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(100, "Email không được quá 100 ký tự"),
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .transform((val) => val.replace(/\s/g, "")),
});

const gender = ["male", "female", "other"] as const;

// Student validation schema
export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Tên học sinh là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
  dob: z.string().min(1, "Ngày sinh là bắt buộc"),

  //@ts-ignore
  gender: z.enum(gender, {
    required_error: "Giới tính là bắt buộc",
    invalid_type_error: "Giới tính không hợp lệ",
  }),
  grade: z.string().min(1, "Lớp là bắt buộc"),
  parentId: z.string().min(1, "Phụ huynh là bắt buộc"),
});

// Enrollment validation schema
export const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Vui lòng chọn học sinh"),
  classId: z.string().min(1, "Vui lòng chọn lớp học"),
});

// Type exports
export type ClassFormData = z.infer<typeof classSchema>;
export type ParentFormData = z.infer<typeof parentSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
