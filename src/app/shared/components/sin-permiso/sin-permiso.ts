import { Component } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService } from '@core/services/auth.service';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-sin-permiso',
  standalone: false,
  templateUrl: './sin-permiso.html',
  styleUrl: './sin-permiso.css',
})
export class SinPermiso {
  constructor(
    private navigationService: NavigationService,
    private userService: AuthService,
    private alertaService: AlertasService,
  ) {}

  Salir() {
    this.alertaService
      .mostrarAlertaConfirmacion(
        '¿Estas seguro de salir de la aplicación?',
        '',
        '¡Salir!',
        'Cancelar',
      )
      .then((confirmed) => {
        if (confirmed) {
          this.userService.logout();
        }
      })
      .catch(() => {
        this.userService.logout();
      });
  }

  regresar(): void {
    this.navigationService.goBack();
  }
}
