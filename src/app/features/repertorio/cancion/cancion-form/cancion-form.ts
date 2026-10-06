import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Cancion } from '@shared/models/cancion';
import { CancionService } from '@shared/services/cancion.service';

import { CatalogosService } from '@core/services/catalogos.service';
import { GrupoService } from '@shared/services/grupo.service';
import { GrupoResponse } from '@shared/models/grupo';
import { InterpretacionResponse } from '@core/models/catalogos';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cancion-form',
  standalone: false,
  templateUrl: './cancion-form.html',
  styleUrl: './cancion-form.css',
})
export class CancionForm implements OnInit {
  form: FormGroup;

  cancion: Cancion = {
    cancionId: 0,
    nombre: '',
    duracion: '',
    publicacion: '',
    genero: '',
    interpretacionId: 3,
    grupoId: 0,
  };

  edit: boolean = false;

  grupos: GrupoResponse[] = [];
  interpretaciones: InterpretacionResponse[] = [];

  search: any;

  constructor(
    private service: CancionService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private catalogosService: CatalogosService,
    private grupoService: GrupoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      duracion: ['', Validators.required],
      publicacion: ['', Validators.required],
      genero: ['', Validators.required],
      interpretacionId: [
        this.cancion.interpretacionId || 0,
        [Validators.required, noCeroValidator()],
      ],
      grupoId: [this.cancion.grupoId || 0, [Validators.required, noCeroValidator()]],
    });
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.cancion = res;
          this.edit = true;

          this.form.patchValue({
            ...this.cancion,
            publicacion: formatearFechaInput(this.cancion.publicacion!),
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
    this.obtenerInterpretacion();
  }

  add() {
    const request: Cancion = { ...this.cancion, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast(
          `La canción '${request.nombre}' fue agregada con éxito`,
          'Canción Agregada',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Cancion = { ...this.cancion, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast(
          `La canción '${request.nombre}' fue actualizada con éxito`,
          'Canción Actualizada',
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

  obtenerInterpretacion() {
    this.catalogosService.getInterpretacion().subscribe({
      next: (res) => {
        this.interpretaciones = res;
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

  getNombreInterpretacion(id: number): string | null {
    if (!id || !this.interpretaciones || this.interpretaciones.length === 0) return null;

    const item = this.interpretaciones.find((t) => +t.InterpretacionId === +id);
    return item?.Interpretacion || null;
  }

  getImagenGrupo(id: number): string | null {
    if (!id || !this.grupos || this.grupos.length === 0) return null;

    const item = this.grupos.find((t) => +t.grupoId === +id);
    return item?.logo || null;
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
  //#endregion Refresh

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    duracion: { required: 'El campo Duración es requerido.' },
    publicacion: { required: 'El campo Publicación es requerido.' },
    genero: { required: 'El campo Género es requerido.' },
    interpretacionId: {
      required: 'El campo Interpretación es requerido.',
      noCero: 'Debes seleccionar una Interpretación',
    },
    grupoId: {
      required: 'El campo Grupo es requerido.',
      noCero: 'Debes seleccionar un Grupo',
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
