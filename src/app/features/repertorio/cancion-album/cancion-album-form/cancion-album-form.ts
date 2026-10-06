import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { CancionAlbum } from '@shared/models/cancion-album';
import { CancionAlbumService } from '@shared/services/cancion-album.service';

import { CancionService } from '@shared/services/cancion.service';
import { AlbumService } from '@shared/services/album.service';
import { CancionResponse } from '@shared/models/cancion';
import { AlbumResponse } from '@shared/models/album';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cancion-album-form',
  standalone: false,
  templateUrl: './cancion-album-form.html',
  styleUrl: './cancion-album-form.css',
})
export class CancionAlbumForm implements OnInit {
  form: FormGroup;

  cancionAlbum: CancionAlbum = {
    cancionAlbumId: 0,
    cancionId: 0,
    albumId: 0,
    numero: 0,
  };

  edit: boolean = false;

  canciones: CancionResponse[] = [];
  albumes: AlbumResponse[] = [];

  search: any;

  constructor(
    private service: CancionAlbumService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private cancionService: CancionService,
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      cancionId: [this.cancionAlbum.cancionId || 0, [Validators.required, noCeroValidator()]],
      albumId: [this.cancionAlbum.albumId || 0, [Validators.required, noCeroValidator()]],
      numero: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.cancionAlbum = res;
          this.edit = true;

          this.form.patchValue({ ...this.cancionAlbum });
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
    this.obtenerCancion();
    this.obtenerAlbum();
  }

  add() {
    const request: CancionAlbum = { ...this.cancionAlbum, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast('La canción fue agregada con éxito', 'Canción Agregada');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: CancionAlbum = { ...this.cancionAlbum, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast('La canción fue actualizada con éxito', 'Canción Actualizada');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Otras Tablas
  obtenerCancion() {
    this.cancionService.getLista().subscribe({
      next: (res) => {
        this.canciones = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  obtenerAlbum() {
    this.albumService.getLista().subscribe({
      next: (res) => {
        this.albumes = res;
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
  getNombreCancion(id: number): string | null {
    if (!id || !this.canciones || this.canciones.length === 0) return null;

    const item = this.canciones.find((t) => +t.cancionId === +id);
    return item?.nombre || null;
  }

  getNombreAlbum(id: number): string | null {
    if (!id || !this.albumes || this.albumes.length === 0) return null;

    const item = this.albumes.find((t) => +t.albumId === +id);
    return item?.nombre || null;
  }

  getImagenAlbum(id: number): string | null {
    if (!id || !this.albumes || this.albumes.length === 0) return null;

    const item = this.albumes.find((t) => +t.albumId === +id);
    return item?.portada || null;
  }
  //#endregion Buscar Dato

  regresar() {
    this.navigationService.goBack();
  }

  //#region Refresh
  refrescarCanciones() {
    this.obtenerCancion();
    this.alerta.successtroast('Lista de canciones actualizada', 'Actualizado');
  }

  refrescarAlbumes() {
    this.obtenerAlbum();
    this.alerta.successtroast('Lista de álbumes actualizada', 'Actualizado');
  }
  //#endregion Refresh

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    cancionId: {
      required: 'El campo Canción es requerido.',
      noCero: 'Debes seleccionar una Canción',
    },
    albumId: {
      required: 'El campo Álbum es requerido.',
      noCero: 'Debes seleccionar un Álbum',
    },
    numero: {
      required: 'El campo Número es requerido.',
      min: 'El número debe ser mayor a 0.',
      pattern: 'El número debe ser un entero.',
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
