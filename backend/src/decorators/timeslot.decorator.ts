import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { TIME_SLOT_REGEX } from 'src/constants/regex';

export function IsTimeSlot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTimeSlot',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          if (!TIME_SLOT_REGEX.test(value)) {
            return false;
          }

          const [startTime, endTime] = value.split('-');
          const [startHours, startMinutes] = startTime.split(':').map(Number);
          const [endHours, endMinutes] = endTime.split(':').map(Number);

          const startTotalMinutes = startHours * 60 + startMinutes;
          const endTotalMinutes = endHours * 60 + endMinutes;

          return endTotalMinutes > startTotalMinutes;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format HH:mm-HH:mm and end time must be greater than start time`;
        },
      },
    });
  };
}
