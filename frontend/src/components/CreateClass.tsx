"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import { Save, BookOpen } from "lucide-react";
import { classSchema, type ClassFormData } from "../schemas/validation";
import { apiService } from "../lib/api";
import { useToast } from "./Toast";
import TimeSlotInput from "./TimeSlotInput";

const CreateClass: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: "",
      subject: "",
      dayOfWeek: "",
      timeSlot: "",
      teacher: "",
      maxStudents: 30,
    },
  });

  // Use ahooks useRequest for API call
  const { loading, run: createClass } = useRequest(apiService.createClass, {
    manual: true,
    onSuccess: () => {
      showSuccess("Tạo lớp thành công!");
      reset();
    },
    onError: (error) => {
      showError("Lỗi tạo lớp", error.message);
    },
  });

  const daysOfWeek = [
    { value: "1", label: "Thứ 2" },
    { value: "2", label: "Thứ 3" },
    { value: "3", label: "Thứ 4" },
    { value: "4", label: "Thứ 5" },
    { value: "5", label: "Thứ 6" },
    { value: "6", label: "Thứ 7" },
    { value: "0", label: "Chủ nhật" },
  ];

  const onSubmit = async (data: ClassFormData) => {
    createClass({
      name: data.className,
      subject: data.subject,
      dayOfWeek: +data.dayOfWeek,
      timeSlot: data.timeSlot,
      teacherName: data.teacher,
      maxStudents: data.maxStudents,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Tạo Lớp Học Mới
            </h2>
            <p className="text-gray-600">Nhập thông tin để tạo lớp học mới</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Lớp *
              </label>
              <input
                type="text"
                {...register("className")}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.className ? "border-red-500" : "border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                placeholder="Ví dụ: Lớp 10A1"
              />
              {errors.className && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.className.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Môn Học *
              </label>
              <input
                type="text"
                {...register("subject")}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                placeholder="Ví dụ: Toán học"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày Trong Tuần *
              </label>
              <select
                {...register("dayOfWeek")}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.dayOfWeek ? "border-red-500" : "border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              >
                <option value="">Chọn ngày</option>
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Giáo Viên *
              </label>
              <input
                type="text"
                {...register("teacher")}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.teacher ? "border-red-500" : "border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
              {errors.teacher && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.teacher.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số Học Sinh Tối Đa *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                {...register("maxStudents", { valueAsNumber: true })}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.maxStudents ? "border-red-500" : "border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              />
              {errors.maxStudents && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxStudents.message}
                </p>
              )}
            </div>
          </div>

          {/* Time Slot Input - Full Width */}
          <div className="col-span-full">
            <Controller
              name="timeSlot"
              control={control}
              render={({ field }) => (
                <TimeSlotInput
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.timeSlot?.message}
                  disabled={loading}
                />
              )}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Lưu ý:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Tất cả các trường có dấu (*) là bắt buộc</li>
              <li>• Tên lớp và môn học không được quá 50 ký tự</li>
              <li>• Số học sinh tối đa từ 1 đến 50</li>
              <li>• Khung giờ phải có thời lượng ít nhất 30 phút</li>
              <li>• Giờ kết thúc phải sau giờ bắt đầu</li>
            </ul>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Tạo Lớp</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
