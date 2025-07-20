"use client";

import type React from "react";
import { useRequest } from "ahooks";
import { Calendar, Clock, User, RefreshCw, BookOpen } from "lucide-react";
import { apiService } from "../lib/api";
import { useToast } from "./Toast";

interface ClassSchedule {
  id: string;
  name: string;
  subject: string;
  dayOfWeek: number;
  timeSlot: string;
  teacherName: string;
  maxStudents: number;
  registered: number;
}

const Schedule: React.FC = () => {
  const { showError } = useToast();

  const {
    data: { data: classes = [] } = {},
    loading,
    refresh,
  } = useRequest(apiService.getAllClasses, {
    onError: (error) => {
      showError("Lỗi tải thời khóa biểu", error.message);
    },
  });

  const daysOfWeek = [
    { value: 1, label: "Thứ 2", color: "bg-blue-50 border-blue-200" },
    { value: 2, label: "Thứ 3", color: "bg-green-50 border-green-200" },
    { value: 3, label: "Thứ 4", color: "bg-yellow-50 border-yellow-200" },
    { value: 4, label: "Thứ 5", color: "bg-purple-50 border-purple-200" },
    { value: 5, label: "Thứ 6", color: "bg-pink-50 border-pink-200" },
    { value: 6, label: "Thứ 7", color: "bg-indigo-50 border-indigo-200" },
    { value: 0, label: "Chủ nhật", color: "bg-red-50 border-red-200" },
  ];

  // Parse start time from timeSlot for sorting
  const parseStartTime = (timeSlot: string) => {
    const startTime = timeSlot.split("-")[0];
    const [hours, minutes] = startTime.split(":").map(Number);
    return hours * 60 + minutes; // Convert to minutes for easy comparison
  };

  // Get classes for a specific day and sort by start time
  const getClassesForDay = (dayValue: number) => {
    return classes
      .filter((cls: ClassSchedule) => cls.dayOfWeek === dayValue)
      .sort((a: ClassSchedule, b: ClassSchedule) => {
        return parseStartTime(a.timeSlot) - parseStartTime(b.timeSlot);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          <span>Đang tải thời khóa biểu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh Sách Lớp</h2>
            <p className="text-gray-600">
              Xem lịch học của tất cả các lớp theo từng ngày
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          } text-white shadow-lg`}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {daysOfWeek.map((day) => {
          const dayClasses = getClassesForDay(day.value);

          return (
            <div
              key={day.value}
              className={`rounded-2xl border-2 ${day.color} overflow-hidden shadow-lg`}
            >
              {/* Day Header */}
              <div className="px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{day.label}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({dayClasses.length} lớp)
                  </span>
                </h3>
              </div>

              {/* Classes List */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {dayClasses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Không có lớp học</p>
                  </div>
                ) : (
                  dayClasses.map((cls: ClassSchedule) => (
                    <div
                      key={cls.id}
                      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                    >
                      {/* Class Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            {cls.name}
                          </h4>
                          <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                            {cls.subject}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{cls.timeSlot}</span>
                          </div>
                        </div>
                      </div>

                      {/* Class Details */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            GV: {cls.teacherName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Sĩ số:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800">
                              {cls.registered}/{cls.maxStudents}
                            </span>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                cls.registered >= cls.maxStudents
                                  ? "bg-red-500"
                                  : cls.registered >= cls.maxStudents * 0.8
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              cls.registered >= cls.maxStudents
                                ? "bg-red-500"
                                : cls.registered >= cls.maxStudents * 0.8
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (cls.registered / cls.maxStudents) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
