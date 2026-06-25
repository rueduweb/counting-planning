import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function sundayValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const date = new Date(control.value);

    return date.getDay() === 0
      ? null
      : { notSunday: true };
  };
}
