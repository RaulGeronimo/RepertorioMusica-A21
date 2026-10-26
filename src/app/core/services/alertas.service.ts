import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '@core/models/api-error';
import { environment } from '@environments/environment';
import { AlbumService } from '@shared/services/album.service';
import { ArtistaGrupoService } from '@shared/services/artista-grupo.service';
import { ArtistaService } from '@shared/services/artista.service';
import { CancionAlbumService } from '@shared/services/cancion-album.service';
import { CancionService } from '@shared/services/cancion.service';
import { DisqueraService } from '@shared/services/disquera.service';
import { GrupoService } from '@shared/services/grupo.service';
import { InstrumentoArtistaService } from '@shared/services/instrumento-artista.service';
import { InstrumentoService } from '@shared/services/instrumento.service';
import { PaisService } from '@shared/services/pais.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  timeOut: number = 2500;
  alertResponseTime: number = environment.tiempoAlerta;

  //Mensajes eliminacion
  Titulo: string = '¿Estas seguro de eliminar el registro?';
  Mensaje: string = '¡No podrás revertir esto!';
  MsjConfirmacion: string = '¡Sí, bórralo!';
  MsjCancelacion: string = 'Cancelar';
  constructor(
    private toastr: ToastrService,
    private router: Router,

    private paisService: PaisService,
    private instrumentoService: InstrumentoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private disqueraService: DisqueraService,
    private albumService: AlbumService,
    private cancionService: CancionService,
    private artistaGrupoService: ArtistaGrupoService,
    private cancionesAlbumService: CancionAlbumService,
    private instrumentoArtistaGrupoService: InstrumentoArtistaService,
  ) {}

  manejarError(err: HttpErrorResponse, titulo: string) {
    if (err.status === 400 || err.status === 401) {
      const body = err.error as ApiError | null;
      this.warning(body?.message || titulo, titulo);
    } else {
      console.error(err);
      this.errorServidor();
    }
  }

  //#region Sweet Alert
  public errorServidor() {
    localStorage.clear();
    this.router.navigate(['login']);

    Swal.fire({
      title: 'Error de Servidor',
      text: 'Espere un momento',
      icon: 'question',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: this.timeOut,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public SinResultados() {
    this.warning(
      'Sin Registros',
      'No existen registros ingresados que coincidan con los criterios proporcionados.',
    );
  }

  public mostrarAlertaConfirmacion(
    titulo: string,
    msg: string,
    msjConfirm: string,
    msjCancel: string,
  ): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: msjConfirm,
      cancelButtonText: msjCancel,
      timer: this.alertResponseTime,
      timerProgressBar: true,
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  public error(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public info(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'info',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public question(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public success(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'success',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public warning(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public mostrarAlertaSimple(titulo: string, texto: string, icono: 'success' | 'error' | 'info') {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      timer: this.alertResponseTime,
      timerProgressBar: true,
    });
  }
  //#endregion Sweet Alert

  //#region Troast
  public successtroast(titulo: string, mensaje: string) {
    this.toastr.success(titulo, mensaje, { timeOut: this.timeOut });
  }

  public errortroast(titulo: string, mensaje: string) {
    this.toastr.error(titulo, mensaje, { timeOut: this.timeOut });
  }

  public infotroast(titulo: string, mensaje: string) {
    this.toastr.info(titulo, mensaje, { timeOut: this.timeOut });
  }

  public warningtroast(titulo: string, mensaje: string) {
    this.toastr.warning(titulo, mensaje, { timeOut: this.timeOut });
  }
  //#endregion Troast

  //#region Reportes
  public reporte(archivo: string) {
    Swal.fire({
      title: 'Reporte Generado Correctamente',
      text: 'Reporte de ' + archivo,
      icon: 'success',
      showConfirmButton: false,
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`,
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster`,
      },
    });
  }

  public async errorReporte(err: HttpErrorResponse, leerMensaje: (e: any) => Promise<string>) {
    if (err.status === 404) {
      this.SinResultados();
      return;
    }

    if (err.status === 400 || err.status === 401) {
      const mensaje = await leerMensaje(err);
      this.warning('No se pudo generar el reporte', mensaje);
      return;
    }

    console.error(err);
    this.errorServidor();
  }
  //#endregion Reportes

  //#region Pais
  public borrarPais(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.paisService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El país fue eliminado con éxito', 'País eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Pais

  //#region Instrumento
  public borrarInstrumento(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.instrumentoService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El instrumento fue eliminado con éxito', 'Instrumento eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Instrumento

  //#region Artista
  public borrarArtista(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.artistaService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El artista fue eliminado con éxito', 'Artista eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Artista

  //#region Grupo
  public borrarGrupo(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.grupoService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El grupo fue eliminado con éxito', 'Grupo eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Grupo

  //#region Disquera
  public borrarDisquera(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.disqueraService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('La disquera fue eliminada con éxito', 'Disquera eliminada');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Disquera

  //#region Album
  public borrarAlbum(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.albumService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El álbum fue eliminado con éxito', 'Álbum eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Album

  //#region Cancion
  public borrarCancion(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.cancionService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('La canción fue eliminada con éxito', 'Canción eliminada');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Cancion

  //#region Artista Grupo
  public borrarArtistaGrupo(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.artistaGrupoService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El artista fue eliminado con éxito', 'Artista eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Artista Grupo

  //#region Cancion Album
  public borrarCancionAlbum(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.cancionesAlbumService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('La canción fue eliminada con éxito', 'Canción eliminada');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Cancion Album

  //#region Artista Instrumento
  public borrarArtistaInstrumento(id: number, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion,
    ).then((confirmed) => {
      if (confirmed) {
        this.instrumentoArtistaGrupoService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast('El instrumento fue eliminado con éxito', 'Instrumento eliminado');
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          },
        );
      }
    });
  }
  //#endregion Artista Instrumento
}
