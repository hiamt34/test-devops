import { BadRequestException } from '@nestjs/common';
import { TIME_SLOT_REGEX } from 'src/constants/regex';

export function convertTimeSlotToRange(value: string): number[] {
  if (TIME_SLOT_REGEX.test(value) === false)
    throw new BadRequestException('Invalid time slot format');
  const [startTime, endTime] = value.split('-');
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return [startTotalMinutes, endTotalMinutes];
}
