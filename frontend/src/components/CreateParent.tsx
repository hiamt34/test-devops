"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import { Save, Users, Mail, Phone, User } from "lucide-react";
import { parentSchema, type ParentFormData } from "../schemas/validation";
import { apiService } from "../lib/api";
import { useToast } from "./Toast";

const CreateParent: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { loading, run: createParent } = useRequest(apiService.createParent, {
    manual: true,
    onSuccess: () => {
      showSuccess("Tạo phụ huynh thành công!");
      reset();
    },
    onError: (error) => {
      showError("Lỗi tạo phụ huynh", error.message);
    },
  });

  const onSubmit = async (data: ParentFormData) => {
    createParent({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-green-100 p-3 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Tạo Phụ Huynh Mới
            </h2>
            <p className="text-gray-600">Nhập thông tin phụ huynh</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Họ và Tên *</span>
              </div>
            </label>
            <input
              type="text"
              {...register("name")}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.name ? "border-red-500" : "border-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              placeholder="Nhập họ và tên phụ huynh"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email *</span>
              </div>
            </label>
            <input
              type="email"
              {...register("email")}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Số Điện Thoại *</span>
              </div>
            </label>
            <input
              type="tel"
              {...register("phone")}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              placeholder="0123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Lưu ý:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Tất cả các trường có dấu (*) là bắt buộc</li>
              <li>• Email sẽ được sử dụng để liên lạc và thông báo</li>
              <li>• Số điện thoại phải có 10-11 chữ số</li>
              <li>• Tên chỉ được chứa chữ cái và khoảng trắng</li>
            </ul>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                  <span>Tạo Phụ Huynh</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateParent;
