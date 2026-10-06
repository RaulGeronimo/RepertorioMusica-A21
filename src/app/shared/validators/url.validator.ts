import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const DOMINIO_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const IPV4_REGEX = /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/;

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;

    if (val === null || val === undefined || val === '') {
      return null;
    }

    try {
      const url = new URL(String(val).trim());
      const host = url.hostname;

      const protocoloValido = url.protocol === 'http:' || url.protocol === 'https:';
      const hostValido = host === 'localhost' || IPV4_REGEX.test(host) || DOMINIO_REGEX.test(host);

      return protocoloValido && hostValido ? null : { urlInvalida: true };
    } catch {
      return { urlInvalida: true };
    }
  };
}
