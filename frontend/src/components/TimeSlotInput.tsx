"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimeSlotInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const TimeSlotInput: React.FC<TimeSlotInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [controller, setController] = useState<{
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
  }>({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });

  const startHourRef = useRef<HTMLInputElement>(null);
  const startMinuteRef = useRef<HTMLInputElement>(null);
  const endHourRef = useRef<HTMLInputElement>(null);
  const endMinuteRef = useRef<HTMLInputElement>(null);

  // Parse value into individual components
  const parseTimeSlot = (timeSlot: string) => {
    const match = timeSlot.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
    if (match) {
      return {
        startHour: match[1],
        startMinute: match[2],
        endHour: match[3],
        endMinute: match[4],
      };
    }
    return {
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
    };
  };

  // Sync with external value changes (like form reset)
  useEffect(() => {
    const parsed = parseTimeSlot(value);
    setController(parsed);
  }, [value]);

  // Handle input change with validation
  const handleInputChange = (
    inputValue: string,
    type: "hour" | "minute",
    position: "start" | "end",
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    // Only allow numbers
    const numericValue = inputValue.replace(/\D/g, "");

    // Limit to 2 characters first
    if (numericValue.length > 2) {
      return; // Don't process if more than 2 digits
    }

    // Validate based on type
    let validatedValue = numericValue;
    let key: keyof typeof controller;

    if (type === "hour") {
      key = position === "start" ? "startHour" : "endHour";
      const hour = Number.parseInt(numericValue || "0");
      if (hour > 23) {
        validatedValue = "23";
      }
    } else if (type === "minute") {
      key = position === "start" ? "startMinute" : "endMinute";
      const minute = Number.parseInt(numericValue || "0");
      if (minute > 59) {
        validatedValue = "59";
      }
    }

    setController((prev) => ({
      ...prev,
      [key!]: validatedValue,
    }));

    // Auto-focus to next field when current field is complete (2 digits)
    if (validatedValue.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  // Update parent when controller changes
  useEffect(() => {
    const { startHour, startMinute, endHour, endMinute } = controller;
    const done = Object.values(controller).every((value) => value.length === 2);
    if (done) {
      onChange(`${startHour}:${startMinute}-${endHour}:${endMinute}`);
    }
  }, [controller, onChange]);

  // Handle backspace to move to previous field
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
    prevRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    if (e.key === "Backspace" && currentValue === "" && prevRef?.current) {
      prevRef.current.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const timeMatch = pastedText.match(
      /^(\d{1,2}):?(\d{2})-?(\d{1,2}):?(\d{2})$/
    );

    if (timeMatch) {
      const [, sH, sM, eH, eM] = timeMatch;
      const validStartHour = Math.min(Number.parseInt(sH), 23).toString();
      const validStartMinute = Math.min(Number.parseInt(sM), 59).toString();
      const validEndHour = Math.min(Number.parseInt(eH), 23).toString();
      const validEndMinute = Math.min(Number.parseInt(eM), 59).toString();

      setController({
        startHour: validStartHour,
        startMinute: validStartMinute,
        endHour: validEndHour,
        endMinute: validEndMinute,
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-4 w-4" />
          <span>Khung Giờ *</span>
        </div>
      </label>

      <div className="flex items-center space-x-2 text-lg">
        {/* Start Time */}
        <div className="flex items-center space-x-1">
          <input
            ref={startHourRef}
            type="text"
            value={controller.startHour}
            onChange={(e) =>
              handleInputChange(e.target.value, "hour", "start", startMinuteRef)
            }
            onKeyDown={(e) => handleKeyDown(e, controller.startHour)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="HH"
            maxLength={2}
          />
          <span className="text-gray-500 font-bold">:</span>
          <input
            ref={startMinuteRef}
            type="text"
            value={controller.startMinute}
            onChange={(e) =>
              handleInputChange(e.target.value, "minute", "start", endHourRef)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, controller.startMinute, startHourRef)
            }
            disabled={disabled}
            className={`w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="mm"
            maxLength={2}
          />
        </div>

        {/* Separator */}
        <span className="text-gray-500 font-bold text-xl px-2">-</span>

        {/* End Time */}
        <div className="flex items-center space-x-1">
          <input
            ref={endHourRef}
            type="text"
            value={controller.endHour}
            onChange={(e) =>
              handleInputChange(e.target.value, "hour", "end", endMinuteRef)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, controller.endHour, startMinuteRef)
            }
            disabled={disabled}
            className={`w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="HH"
            maxLength={2}
          />
          <span className="text-gray-500 font-bold">:</span>
          <input
            ref={endMinuteRef}
            type="text"
            value={controller.endMinute}
            onChange={(e) => handleInputChange(e.target.value, "minute", "end")}
            onKeyDown={(e) =>
              handleKeyDown(e, controller.endMinute, endHourRef)
            }
            disabled={disabled}
            className={`w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="mm"
            maxLength={2}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TimeSlotInput;
