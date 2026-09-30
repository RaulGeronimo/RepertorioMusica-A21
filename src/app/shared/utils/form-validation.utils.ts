import { AbstractControl } from '@angular/forms';

export interface ValidationMessages {
  [errorKey: string]: string;
}

export class FormValidationUtils {
  static getValidationClasses(control: AbstractControl | null, groupError = false) {
    return {
      'is-invalid': (control?.invalid || groupError) && control?.touched,
      'is-valid': control?.valid && control?.touched && !groupError,
    };
  }

  static getErrorMessage(
    control: AbstractControl | null,
    messages: ValidationMessages,
  ): string | null {
    if (!control || !control.touched || !control.errors) return null;
    const firstErrorKey = Object.keys(control.errors)[0];
    return messages[firstErrorKey] ?? 'Campo inválido.';
  }
}
