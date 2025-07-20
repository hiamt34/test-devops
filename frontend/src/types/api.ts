// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Entity types
export interface Class {
  id: string;
  name: string;
  subject: string;
  dayOfWeek: number;
  timeSlot: string;
  teacherName: string;
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  currentGrade: string;
  parentId: string;
  parent?: Parent;
}
