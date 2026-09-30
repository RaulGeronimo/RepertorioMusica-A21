import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

//#region Validador genérico de rango de fechas
export function fechaMayorQueValidator(
  campoInicio: string,
  campoFin: string,
  permitirIgual: boolean = false,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const inicio = formGroup.get(campoInicio)?.value;
    const fin = formGroup.get(campoFin)?.value;

    if (!inicio || !fin) {
      return null;
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    const esInvalida = permitirIgual ? fechaFin < fechaInicio : fechaFin <= fechaInicio;

    if (esInvalida) {
      const error = { [`${campoFin}MayorQue${campoInicio}`]: true };
      formGroup.get(campoFin)?.setErrors(error);
      return error;
    }

    if (formGroup.get(campoFin)?.hasError(`${campoFin}MayorQue${campoInicio}`)) {
      formGroup.get(campoFin)?.setErrors(null);
    }

    return null;
  };
}
//#endregion Validador genérico de rango de fechas

export function limiteFecha(campo: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(campo);
    const fecha = control?.value;

    if (!fecha) {
      return null;
    }

    const [year, month, day] = fecha.split('-').map(Number);
    const fin = new Date(year, month - 1, day);

    const actual = new Date();
    actual.setHours(0, 0, 0, 0);

    if (fin > actual) {
      const error = { fechaFutura: true };
      control?.setErrors(error);
      return error;
    }

    if (control?.hasError('fechaFutura')) {
      control?.setErrors(null);
    }

    return null;
  };
}
