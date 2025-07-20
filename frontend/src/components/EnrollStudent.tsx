"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import { Save, UserCheck, Users, GraduationCap, RefreshCw } from "lucide-react";
import {
  enrollmentSchema,
  type EnrollmentFormData,
} from "../schemas/validation";
import { apiService } from "../lib/api";
import { useToast } from "./Toast";

interface Student {
  id: string;
  name: string;
  currentGrade: string;
  parent?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Class {
  id: string;
  name: string;
  subject: string;
  teacherName: string;
  dayOfWeek: number;
  timeSlot: string;
  maxStudents: number;
  registered: number;
}

const EnrollStudent: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: "",
      classId: "",
    },
  });

  const watchedClassId = watch("classId");
  const watchedStudentId = watch("studentId");

  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  // Fetch students
  const {
    data: { data: students = [] } = {},
    loading: loadingStudents,
    refresh: refreshStudents,
  } = useRequest(apiService.getStudents, {
    onError: (error) => {
      showError("Lỗi tải danh sách học sinh", error.message);
    },
  });

  // Fetch classes
  const {
    data: { data: classes = [] } = {},
    loading: loadingClasses,
    refresh: refreshClasses,
  } = useRequest(apiService.getAllClasses, {
    onError: (error) => {
      showError("Lỗi tải danh sách lớp", error.message);
    },
  });

  // Register student
  const { loading: enrolling, run: registerStudent } = useRequest(
    apiService.registerStudent,
    {
      manual: true,
      onSuccess: () => {
        const student = students.find(
          (s: Student) => s.id === watchedStudentId
        );
        const selectedClass = classes.find(
          (cls: Class) => cls.id === watchedClassId
        );

        showSuccess(
          "Đăng ký thành công!",
          `${student?.name} đã được đăng ký vào ${selectedClass?.name}`
        );

        refreshClasses();

        reset();
      },
      onError: (error) => {
        showError("Lỗi đăng ký", error.message);
      },
    }
  );

  // Validate class capacity when class changes
  React.useEffect(() => {
    if (watchedClassId) {
      const selectedClass = classes.find(
        (cls: Class) => cls.id === watchedClassId
      );
      if (
        selectedClass &&
        selectedClass.currentStudents >= selectedClass.maxStudents
      ) {
        setError("classId", {
          type: "manual",
          message: "Lớp đã đầy, không thể đăng ký thêm",
        });
      } else {
        clearErrors("classId");
      }
    }
  }, [watchedClassId, classes, setError, clearErrors]);

  const onSubmit = async (data: EnrollmentFormData) => {
    // Additional validation for class capacity
    const selectedClass = classes.find((cls: Class) => cls.id === data.classId);
    if (
      selectedClass &&
      selectedClass.currentStudents >= selectedClass.maxStudents
    ) {
      setError("classId", {
        type: "manual",
        message: "Lớp đã đầy, không thể đăng ký thêm",
      });
      return;
    }

    registerStudent(data.classId, {
      studentId: data.studentId,
    });
  };

  const selectedClass = classes.find((cls: Class) => cls.id === watchedClassId);
  const selectedStudent = students.find(
    (s: Student) => s.id === watchedStudentId
  );

  const isLoading = loadingStudents || loadingClasses;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Đăng Ký Học Sinh Vào Lớp
              </h2>
              <p className="text-gray-600">
                Chọn học sinh và lớp học để đăng ký
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshStudents}
              disabled={loadingStudents}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingStudents ? "animate-spin" : ""}`}
              />
              <span>Học sinh</span>
            </button>
            <button
              onClick={refreshClasses}
              disabled={loadingClasses}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingClasses ? "animate-spin" : ""}`}
              />
              <span>Lớp học</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span>Chọn Học Sinh *</span>
                </div>
              </label>
              <select
                {...register("studentId")}
                disabled={isLoading || enrolling}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.studentId ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading || enrolling
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : ""
                }`}
              >
                <option value="">
                  {loadingStudents ? "Đang tải..." : "Chọn học sinh"}
                </option>
                {students.map((student: Student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - Lớp {student.currentGrade} (PH:{" "}
                    {student.parent?.name || "Chưa có"})
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <p className="text-red-500 text-sm">
                  {errors.studentId.message}
                </p>
              )}

              {selectedStudent && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Thông tin học sinh:
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>
                      <strong>Tên:</strong> {selectedStudent.name}
                    </div>
                    <div>
                      <strong>Lớp:</strong> {selectedStudent.currentGrade}
                    </div>
                    <div>
                      <strong>Phụ huynh:</strong>{" "}
                      {selectedStudent.parent?.name || "Chưa có"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Class Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Chọn Lớp Học *</span>
                </div>
              </label>
              <select
                {...register("classId")}
                disabled={isLoading || enrolling}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.classId ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading || enrolling
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : ""
                }`}
              >
                <option value="">
                  {loadingClasses ? "Đang tải..." : "Chọn lớp học"}
                </option>
                {classes.map((cls: Class) => (
                  <option
                    key={cls.id}
                    value={cls.id}
                    disabled={cls.registered >= cls.maxStudents}
                  >
                    {cls.name} - {cls.subject} ({cls.registered}/
                    {cls.maxStudents})
                    {cls.registered >= cls.maxStudents ? " - ĐÃ ĐẦY" : ""}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-500 text-sm">{errors.classId.message}</p>
              )}

              {selectedClass && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 transition-all duration-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    Thông tin lớp học:
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>
                      <strong>Tên lớp:</strong> {selectedClass.name}
                    </div>
                    <div>
                      <strong>Môn học:</strong> {selectedClass.subject}
                    </div>
                    <div>
                      <strong>Giáo viên:</strong> {selectedClass.teacherName}
                    </div>
                    <div>
                      <strong>Thời gian:</strong>{" "}
                      {daysOfWeek[selectedClass.dayOfWeek]} -{" "}
                      {selectedClass.timeSlot}
                    </div>
                    <div>
                      <strong>Sĩ số:</strong> {selectedClass.registered}/
                      {selectedClass.maxStudents}
                    </div>
                    <div
                      className={`font-medium ${
                        selectedClass.registered >= selectedClass.maxStudents
                          ? "text-red-600"
                          : selectedClass.registered >=
                            selectedClass.maxStudents * 0.8
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedClass.registered >= selectedClass.maxStudents
                        ? "❌ Lớp đã đầy"
                        : selectedClass.registered >=
                          selectedClass.maxStudents * 0.8
                        ? "⚠️ Sắp đầy"
                        : "✅ Còn chỗ trống"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {selectedStudent && selectedClass && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 transition-all duration-200">
              <h4 className="font-medium text-gray-800 mb-4">
                Xác nhận đăng ký:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Học sinh:</span>
                  <div className="font-medium text-gray-800">
                    {selectedStudent.name}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Lớp học:</span>
                  <div className="font-medium text-gray-800">
                    {selectedClass.name} - {selectedClass.subject}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Giáo viên:</span>
                  <div className="font-medium text-gray-800">
                    {selectedClass.teacherName}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Thời gian:</span>
                  <div className="font-medium text-gray-800">
                    {daysOfWeek[selectedClass.dayOfWeek]} -{" "}
                    {selectedClass.timeSlot}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Lưu ý:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Vui lòng kiểm tra kỹ thông tin trước khi đăng ký</li>
              <li>• Học sinh chỉ có thể đăng ký vào lớp còn chỗ trống</li>
              <li>
                • Sau khi đăng ký thành công, thông tin sẽ được cập nhật ngay
                lập tức
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={
                isLoading || enrolling || !selectedStudent || !selectedClass
              }
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isLoading || enrolling || !selectedStudent || !selectedClass
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              } text-white`}
            >
              {enrolling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Đăng Ký</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Available Classes Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Danh sách lớp học có sẵn
        </h3>
        {loadingClasses ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
              <span>Đang tải danh sách lớp...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls: Class) => (
              <div
                key={cls.id}
                className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  cls.registered >= cls.maxStudents
                    ? "border-red-200 bg-red-50"
                    : cls.registered >= cls.maxStudents * 0.8
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="font-medium text-gray-800">{cls.name}</div>
                <div className="text-sm text-gray-600 mt-1">{cls.subject}</div>
                <div className="text-sm text-gray-600">
                  GV: {cls.teacherName}
                </div>
                <div className="text-sm text-gray-600">
                  {daysOfWeek[cls.dayOfWeek]} - {cls.timeSlot}
                </div>
                <div
                  className={`text-sm font-medium mt-2 ${
                    cls.registered >= cls.maxStudents
                      ? "text-red-600"
                      : cls.registered >= cls.maxStudents * 0.8
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {cls.registered}/{cls.maxStudents} học sinh
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollStudent;
