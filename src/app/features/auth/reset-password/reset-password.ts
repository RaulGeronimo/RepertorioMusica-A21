import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '@core/models/usuario';
import { AlertasService } from '@core/services/alertas.service';
import { UsuariosService } from '@core/services/usuarios.service';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  email: FormGroup;
  user: FormGroup;
  password: FormGroup;

  fieldTextType = {
    password1: false,
    password2: false,
  };

  currentStep = signal<number>(1);

  usuario: Usuario = {} as Usuario;
  usuarioEncontrado: Usuario = {} as Usuario;
  usuarioId: number = 0;

  ngOnInit(): void {
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
  }

  constructor(
    private service: UsuariosService,
    private fb: FormBuilder,
    private alerta: AlertasService,
  ) {
    this.email = this.fb.group({
      correo: [
        '',
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required],
      ],
    });

    this.user = this.fb.group({
      usuario: ['', Validators.required],
    });

    this.password = this.fb.group(
      {
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
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  buscarCorreo() {
    this.usuario.correo = this.email.value.correo;

    this.service.Validar(this.usuario).subscribe({
      next: (res) => {
        this.usuarioEncontrado = res;
        this.currentStep.set(2);
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al Validar');
      },
    });
  }

  buscarUsuario() {
    this.usuario.usuario = this.user.value.usuario;

    this.service.Validar(this.usuario).subscribe({
      next: (res) => {
        this.usuarioEncontrado = Array.isArray(res) ? res[0] : res;
        this.usuarioId = this.usuarioEncontrado?.usuarioId ?? 0;
        this.currentStep.set(3);
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al Validar');
      },
    });
  }

  cambiarPassword() {
    this.usuario.password = this.password.value.password;

    this.service.Validar(this.usuario).subscribe({
      next: () => {
        this.currentStep.set(4);
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al Actualizar');
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
  getValidationClasses(form: FormGroup, controlName: string, groupError = false) {
    return FormValidationUtils.getValidationClasses(form.get(controlName), groupError);
  }

  private readonly errorMessagesEmail = {
    correo: {
      required: 'El campo Correo es requerido.',
      pattern: 'El correo no tiene un formato válido.',
    },
  };

  getErrorEmail(controlName: keyof typeof this.errorMessagesEmail): string | null {
    return FormValidationUtils.getErrorMessage(
      this.email.get(controlName),
      this.errorMessagesEmail[controlName],
    );
  }

  private readonly errorMessagesUser = {
    usuario: { required: 'El campo Usuario es requerido.' },
  };

  getErrorUser(controlName: keyof typeof this.errorMessagesUser): string | null {
    return FormValidationUtils.getErrorMessage(
      this.user.get(controlName),
      this.errorMessagesUser[controlName],
    );
  }

  private readonly errorMessagesPassword = {
    password: {
      required: 'La Contraseña es obligatoria.',
      minlength: 'La contraseña debe tener al menos 8 caracteres.',
      pattern: 'La contraseña debe contener mayúscula, minúscula, número y carácter especial.',
    },
    password2: { required: 'Debes confirmar la contraseña.' },
  };

  getErrorPassword(controlName: keyof typeof this.errorMessagesPassword): string | null {
    return FormValidationUtils.getErrorMessage(
      this.password.get(controlName),
      this.errorMessagesPassword[controlName],
    );
  }

  getPassword2Error(): string | null {
    if (!this.password.get('password2')?.touched) return null;
    if (this.password.hasError('mismatch')) return 'Las contraseñas no coinciden.';
    return this.getErrorPassword('password2');
  }
  //#endregion Error Msj
}
