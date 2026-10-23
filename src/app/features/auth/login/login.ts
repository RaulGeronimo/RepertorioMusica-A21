import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '@core/models/usuario';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService, LoginResponse } from '@core/services/auth.service';
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

  modo: 'credenciales' | 'qr' = 'credenciales';
  procesandoQr = signal(false);

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
      mantenerSesion: [false],
    });
  }

  get mantenerControl(): FormControl {
    return this.form.get('mantenerSesion') as FormControl;
  }

  cambiarModo(modo: 'credenciales' | 'qr') {
    this.modo = modo;
  }

  iniciarSesion() {
    const { mantenerSesion, ...credenciales } = this.form.value;
    const request: Usuario = { ...this.usuario, ...credenciales };

    this.service.login(request, !!mantenerSesion).subscribe({
      next: (res) => this.sesionIniciada(res, request.usuario),
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error de autenticación');
      },
    });
  }

  iniciarSesionConQr(contenido: string) {
    this.procesandoQr.set(true);

    this.service.loginConQr(contenido, !!this.mantenerControl.value).subscribe({
      next: (res) => this.sesionIniciada(res),
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error de autenticación');
        this.procesandoQr.set(false);
      },
    });
  }

  private sesionIniciada(res: LoginResponse, nombreUsuario?: string) {
    this.service.guardarTokens(res.accessToken, res.refreshToken, res.expiraEn, res.mantenerSesion);

    const nombre = nombreUsuario || this.service.obtenerDatosUsuario()?.usuario || '';
    this.router.navigate(['repertorio/']);
    this.alerta.successtroast(`Bienvenido '${nombre}'`, 'Usuario Logeado');
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
