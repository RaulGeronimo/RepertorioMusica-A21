import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '@core/models/usuario';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService } from '@core/services/auth.service';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fieldTextType = {
    password1: false,
    password2: false,
  };

  form: FormGroup;

  usuario: Usuario = {
    usuarioId: 0,
    usuario: '',
    correo: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    password: '',
    fechaNacimiento: '',
    rolId: 3,
    activo: true,
  };

  constructor(
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alerta: AlertasService,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        usuario: ['', Validators.required],
        correo: [
          '',
          [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,
            ),
          ],
        ],
        password2: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  add() {
    const request: Usuario = { ...this.usuario, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.router.navigate(['login']);
        this.alerta.success(
          `El usuario '${request.usuario}' fue agregado con éxito`,
          'Usuario Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  toggleFieldTextType(field: 'password1' | 'password2') {
    this.fieldTextType[field] = !this.fieldTextType[field];
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const pass = formGroup.get('password')?.value;
    const confirm = formGroup.get('password2')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  //#region Error Msj
  getValidationClasses(controlName: string, groupError = false) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName), groupError);
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    apellidoPaterno: { required: 'El campo Apellido Paterno es requerido.' },
    apellidoMaterno: { required: 'El campo Apellido Materno es requerido.' },
    usuario: { required: 'El campo Usuario es requerido.' },
    correo: {
      required: 'El campo Correo es requerido.',
      pattern: 'El correo no tiene un formato válido.',
    },
    password: {
      required: 'La Contraseña es obligatoria.',
      minlength: 'La contraseña debe tener al menos 8 caracteres.',
      pattern: 'La contraseña debe contener mayúscula, minúscula, número y carácter especial.',
    },
    password2: { required: 'Debes confirmar la contraseña.' },
    fechaNacimiento: { required: 'El campo Fecha Nacimiento es requerido.' },
  };

  getError(controlName: keyof typeof this.errorMessages): string | null {
    return FormValidationUtils.getErrorMessage(
      this.form.get(controlName),
      this.errorMessages[controlName],
    );
  }

  getPassword2Error(): string | null {
    if (!this.form.get('password2')?.touched) return null;
    if (this.form.hasError('mismatch')) return 'Las contraseñas no coinciden.';
    return this.getError('password2');
  }
  //#endregion Error Msj
}
