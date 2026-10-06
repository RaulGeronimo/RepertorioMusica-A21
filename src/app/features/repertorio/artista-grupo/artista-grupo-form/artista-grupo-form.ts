import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { ArtistaGrupo } from '@shared/models/artista-grupo';
import { ArtistaGrupoService } from '@shared/services/artista-grupo.service';

import { ArtistaService } from '@shared/services/artista.service';
import { GrupoService } from '@shared/services/grupo.service';
import { ArtistaResponse } from '@shared/models/artista';
import { GrupoResponse } from '@shared/models/grupo';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { fechaMayorQueValidator, limiteFecha } from '@shared/validators/date.validators';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-artista-grupo-form',
  standalone: false,
  templateUrl: './artista-grupo-form.html',
  styleUrl: './artista-grupo-form.css',
})
export class ArtistaGrupoForm implements OnInit {
  form: FormGroup;

  artistaGrupo: ArtistaGrupo = {
    artistaGrupoId: 0,
    artistaId: 0,
    grupoId: 0,
    fechaInicio: '',
    fechaFin: '',
  };

  edit: boolean = false;

  artistas: ArtistaResponse[] = [];
  grupos: GrupoResponse[] = [];

  search: any;
  searchGrupo: any;

  constructor(
    private service: ArtistaGrupoService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group(
      {
        artistaId: [this.artistaGrupo.artistaId || 0, [Validators.required, noCeroValidator()]],
        grupoId: [this.artistaGrupo.grupoId || 0, [Validators.required, noCeroValidator()]],
        fechaInicio: ['', Validators.required],
        fechaFin: [''],
      },
      {
        validators: [
          fechaMayorQueValidator('fechaInicio', 'fechaFin', false),
          limiteFecha('fechaInicio'),
          limiteFecha('fechaFin'),
        ],
      },
    );
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.artistaGrupo = res;
          this.edit = true;

          this.form.patchValue({
            ...this.artistaGrupo,
            fechaInicio: formatearFechaInput(this.artistaGrupo.fechaInicio!),
            fechaFin: formatearFechaInput(this.artistaGrupo.fechaFin!),
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
    this.obtenerArtista();
    this.obtenerGrupo();
  }

  add() {
    const request: ArtistaGrupo = {
      ...this.artistaGrupo,
      ...this.form.value,
      fechaFin: this.form.value.fechaFin || null,
    };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast('El artista fue agregado con éxito', 'Artista Agregado');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: ArtistaGrupo = {
      ...this.artistaGrupo,
      ...this.form.value,
      fechaFin: this.form.value.fechaFin || null,
    };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast('El artista fue actualizado con éxito', 'Artista Actualizado');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Otras Tablas
  obtenerArtista() {
    this.artistaService.getLista().subscribe({
      next: (res) => {
        this.artistas = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

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
  //#endregion Otras Tablas

  //#region Buscar Dato
  getNombreArtista(id: number): string | null {
    if (!id || !this.artistas || this.artistas.length === 0) return null;

    const item = this.artistas.find((t) => +t.artistaId === +id);
    return item?.nombreArtistico || null;
  }

  getNombreGrupo(id: number): string | null {
    if (!id || !this.grupos || this.grupos.length === 0) return null;

    const item = this.grupos.find((t) => +t.grupoId === +id);
    return item?.nombre || null;
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
  refrescarArtistas() {
    this.obtenerArtista();
    this.alerta.successtroast('Lista de artistas actualizada', 'Actualizado');
  }

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
    artistaId: {
      required: 'El campo Artista es requerido.',
      noCero: 'Debes seleccionar un Artista',
    },
    grupoId: {
      required: 'El campo Grupo es requerido.',
      noCero: 'Debes seleccionar un Grupo',
    },
    fechaInicio: {
      required: 'El campo Fecha Inicio es requerido.',
      fechaFutura: 'La Fecha Inicio no puede ser una fecha futura.',
    },
    fechaFin: {
      fechaFinMayorQuefechaInicio: 'La Fecha Fin debe ser posterior a la Fecha Inicio.',
      fechaFutura: 'La Fecha Fin no puede ser una fecha futura.',
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
