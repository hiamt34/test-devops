"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import { Save, UserPlus, Calendar, Users, RefreshCw } from "lucide-react";
import { studentSchema, type StudentFormData } from "../schemas/validation";
import { apiService } from "../lib/api";
import { useToast } from "./Toast";

interface Parent {
  id: string;
  name: string;
  email: string;
}

const CreateStudent: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: undefined,
      grade: "",
      parentId: "",
    },
  });

  // Fetch parents list
  const {
    data: { data: parents = [] } = {},
    loading: loadingParents,
    refresh: refreshParents,
  } = useRequest(apiService.getParents, {
    onError: (error) => {
      showError("Lỗi tải danh sách phụ huynh", error.message);
    },
  });

  // Create student
  const { loading: creatingStudent, run: createStudent } = useRequest(
    apiService.createStudent,
    {
      manual: true,
      onSuccess: () => {
        showSuccess("Tạo học sinh thành công!");
        reset();
      },
      onError: (error) => {
        showError("Lỗi tạo học sinh", error.message);
      },
    }
  );

  const grades = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const onSubmit = async (data: StudentFormData) => {
    createStudent({
      name: data.name,
      dob: data.dob,
      gender: data.gender,
      currentGrade: +data.grade,
      parentId: data.parentId,
    });
  };

  const isLoading = creatingStudent || loadingParents;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Tạo Học Sinh Mới
              </h2>
              <p className="text-gray-600">Nhập thông tin học sinh</p>
            </div>
          </div>
          <button
            onClick={refreshParents}
            disabled={loadingParents}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${loadingParents ? "animate-spin" : ""}`}
            />
            <span>Làm mới danh sách</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và Tên *
              </label>
              <input
                type="text"
                {...register("name")}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
                placeholder="Nhập họ và tên học sinh"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Ngày Sinh *</span>
                </div>
              </label>
              <input
                type="date"
                {...register("dob")}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới Tính *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender")}
                    disabled={isLoading}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 disabled:opacity-50"
                  />
                  <span
                    className={`ml-2 text-sm ${
                      isLoading ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Nam
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender")}
                    disabled={isLoading}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 disabled:opacity-50"
                  />
                  <span
                    className={`ml-2 text-sm ${
                      isLoading ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Nữ
                  </span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp *
              </label>
              <select
                {...register("grade")}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.grade ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
              >
                <option value="">Chọn lớp</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    Lớp {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.grade.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Phụ Huynh *</span>
                </div>
              </label>
              <select
                {...register("parentId")}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.parentId ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
              >
                <option value="">
                  {loadingParents ? "Đang tải..." : "Chọn phụ huynh"}
                </option>
                {parents.map((parent: Parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} ({parent.email})
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parentId.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Lưu ý:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Tất cả các trường có dấu (*) là bắt buộc</li>
              <li>• Phụ huynh phải được tạo trước khi tạo học sinh</li>
              <li>• Tên chỉ được chứa chữ cái và khoảng trắng</li>
            </ul>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              } text-white`}
            >
              {creatingStudent ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Tạo Học Sinh</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
