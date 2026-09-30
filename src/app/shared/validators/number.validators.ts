import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noCeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    if (val === 0 || val === '0') {
      return { noCero: true };
    }
    return null;
  };
}
