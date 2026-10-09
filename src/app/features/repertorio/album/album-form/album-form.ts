import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Album } from '@shared/models/album';
import { AlbumService } from '@shared/services/album.service';

import { GrupoService } from '@shared/services/grupo.service';
import { DisqueraService } from '@shared/services/disquera.service';
import { GrupoResponse } from '@shared/models/grupo';
import { DisqueraResponse } from '@shared/models/disquera';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { urlValidator } from '@shared/validators/url.validator';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-album-form',
  standalone: false,
  templateUrl: './album-form.html',
  styleUrl: './album-form.css',
})
export class AlbumForm implements OnInit {
  form: FormGroup;

  album: Album = {
    albumId: 0,
    nombre: '',
    grupoId: 0,
    disqueraId: 0,
    duracion: '',
    lanzamiento: '',
    grabacion: '',
    portada: '',
  };

  edit: boolean = false;

  grupos: GrupoResponse[] = [];
  disqueras: DisqueraResponse[] = [];

  search: any;
  searchDisquera: any;

  constructor(
    private service: AlbumService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private grupoService: GrupoService,
    private disqueraService: DisqueraService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      grupoId: [this.album.grupoId || 0, [Validators.required, noCeroValidator()]],
      disqueraId: [this.album.disqueraId || 0, [Validators.required, noCeroValidator()]],
      duracion: ['', Validators.required],
      lanzamiento: ['', Validators.required],
      grabacion: ['', Validators.required],
      portada: [
        '',
        [
          Validators.required,
          urlValidator(),
          Validators.pattern('.*\\.(png|jpg|jpeg|webp)(\\?.*)?$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.album = res;
          this.edit = true;

          this.form.patchValue({
            ...this.album,
            lanzamiento: formatearFechaInput(this.album.lanzamiento!),
          });
          this.cdr.markForCheck();
          this.form.markAllAsTouched();
        },
        error: (err: unknown) => {
          console.error(err);
          this.alerta.errorServidor();
        },
      });
    }
  }

  obtenerDatos() {
    this.obtenerGrupo();
    this.obtenerDisquera();
  }

  add() {
    const request: Album = { ...this.album, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast(
          `El álbum '${request.nombre}' fue agregado con éxito`,
          'Álbum Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Album = { ...this.album, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast(
          `El álbum '${request.nombre}' fue actualizado con éxito`,
          'Álbum Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Otras Tablas
  obtenerGrupo() {
    this.grupoService.getLista().subscribe({
      next: (res) => {
        this.grupos = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  obtenerDisquera() {
    this.disqueraService.getLista().subscribe({
      next: (res) => {
        this.disqueras = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }
  //#endregion Otras Tablas

  //#region Buscar Dato
  getNombreGrupo(id: number): string | null {
    if (!id || !this.grupos || this.grupos.length === 0) return null;

    const item = this.grupos.find((t) => +t.grupoId === +id);
    return item?.nombre || null;
  }

  getNombreDisquera(id: number): string | null {
    if (!id || !this.disqueras || this.disqueras.length === 0) return null;

    const item = this.disqueras.find((t) => +t.disqueraId === +id);
    return item?.nombre || null;
  }
  //#endregion Buscar Dato

  regresar() {
    this.navigationService.goBack();
  }

  //#region Refresh
  refrescarGrupos() {
    this.obtenerGrupo();
    this.alerta.successtroast('Lista de grupos actualizada', 'Actualizado');
  }

  refrescarDisqueras() {
    this.obtenerDisquera();
    this.alerta.successtroast('Lista de disqueras actualizada', 'Actualizado');
  }
  //#endregion Refresh

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    grupoId: {
      required: 'El campo GrupoId es requerido.',
      noCero: 'Debes seleccionar un Grupo',
    },
    disqueraId: {
      required: 'El campo DisqueraId es requerido.',
      noCero: 'Debes seleccionar una Disquera',
    },
    duracion: { required: 'El campo Duración es requerido.' },
    lanzamiento: { required: 'El campo Lanzamiento es requerido.' },
    grabacion: { required: 'El campo Grabación es requerido.' },
    portada: {
      required: 'El campo Portada es requerido.',
      urlInvalida: 'La portada debe ser una URL válida.',
      pattern: 'La portada debe ser una imagen (png, jpg, jpeg, webp).',
    },
  };

  getError(controlName: keyof typeof this.errorMessages): string | null {
    return FormValidationUtils.getErrorMessage(
      this.form.get(controlName),
      this.errorMessages[controlName],
    );
  }
  //#endregion Error Msj
}
