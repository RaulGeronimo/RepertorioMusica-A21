import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '@core/models/usuario';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService } from '@core/services/auth.service';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  fieldTextType: boolean = false;
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
    rolId: 0,
    activo: true,
  };

  ngOnInit(): void {
    if (this.service.estaAutenticado()) {
      this.router.navigate(['/repertorio']);
    }
  }

  constructor(
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alerta: AlertasService,
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  iniciarSesion() {
    const request: Usuario = { ...this.usuario, ...this.form.value };

    this.service.login(request).subscribe({
      next: (res) => {
        this.service.guardarTokens(res.accessToken, res.refreshToken, res.expiraEn);

        this.router.navigate(['repertorio/']);
        this.alerta.successtroast(`Bienvenido '${request.usuario}'`, 'Usuario Logeado');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error de autenticación');
      },
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    usuario: { required: 'El campo Usuario es requerido.' },
    password: { required: 'La Contraseña es obligatoria.' },
  };

  getError(controlName: keyof typeof this.errorMessages): string | null {
    return FormValidationUtils.getErrorMessage(
      this.form.get(controlName),
      this.errorMessages[controlName],
    );
  }
  //#endregion Error Msj
}
