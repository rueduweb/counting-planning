import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function dateRangeValidator(
  min: Date,
  max: Date
): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (date < min || date > max) {
      return {
        outOfRange: true
      };
    }

    return null;
  };
}
