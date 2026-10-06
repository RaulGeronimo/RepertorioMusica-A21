import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Grupo } from '@shared/models/grupo';
import { GrupoService } from '@shared/services/grupo.service';

import { CatalogosService } from '@core/services/catalogos.service';
import { EstatusResponse } from '@core/models/catalogos';
import { IdiomaResponse } from '@core/models/catalogos';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { fechaMayorQueValidator, limiteFecha } from '@shared/validators/date.validators';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { urlValidator } from '@shared/validators/url.validator';

@Component({
  selector: 'app-grupo-form',
  standalone: false,
  templateUrl: './grupo-form.html',
  styleUrl: './grupo-form.css',
})
export class GrupoForm implements OnInit {
  form: FormGroup;

  grupo: Grupo = {
    grupoId: 0,
    nombre: '',
    origen: '',
    genero: '',
    inicio: '',
    fin: '',
    sellos: '',
    estatusId: 1,
    sitioWeb: '',
    idiomaId: 5,
    logo: '',
  };

  edit: boolean = false;

  estatus: EstatusResponse[] = [];
  idiomas: IdiomaResponse[] = [];

  constructor(
    private service: GrupoService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private catalogosService: CatalogosService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        origen: ['', Validators.required],
        genero: ['', Validators.required],
        inicio: ['', Validators.required],
        fin: [],
        sellos: ['', Validators.required],
        estatusId: [this.grupo.estatusId || 0, [Validators.required, noCeroValidator()]],
        sitioWeb: ['', [Validators.required, urlValidator()]],
        idiomaId: [this.grupo.idiomaId || 0, [Validators.required, noCeroValidator()]],
        logo: [
          this.grupo.logo || '',
          [
            Validators.required,
            urlValidator(),
            Validators.pattern('.*\\.(png|jpg|jpeg|webp)(\\?.*)?$'),
          ],
        ],
      },
      {
        validators: [
          fechaMayorQueValidator('inicio', 'fin', false),
          limiteFecha('inicio'),
          limiteFecha('fin'),
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
          this.grupo = res;
          this.edit = true;

          this.form.patchValue({
            ...this.grupo,
            inicio: formatearFechaInput(this.grupo.inicio!),
            fin: formatearFechaInput(this.grupo.fin!),
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
    this.obtenerEstatus();
    this.obtenerIdioma();
  }

  add() {
    const request: Grupo = {
      ...this.grupo,
      ...this.form.value,
      fin: this.form.value.fin || null,
    };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast(
          `El grupo '${request.nombre}' fue agregado con éxito`,
          'Grupo Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Grupo = {
      ...this.grupo,
      ...this.form.value,
      fin: this.form.value.fin || null,
    };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast(
          `El grupo '${request.nombre}' fue actualizado con éxito`,
          'Grupo Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Catalogos
  obtenerEstatus() {
    this.catalogosService.getEstatus().subscribe({
      next: (res) => {
        this.estatus = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  obtenerIdioma() {
    this.catalogosService.getIdioma().subscribe({
      next: (res) => {
        this.idiomas = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }
  //#endregion Catalogos

  //#region Buscar Dato
  getNombreEstatus(id: number): string | null {
    if (!id || !this.estatus || this.estatus.length === 0) return null;

    const item = this.estatus.find((t) => +t.EstatusId === +id);
    return item?.Estatus || null;
  }

  getNombreIdioma(id: number): string | null {
    if (!id || !this.idiomas || this.idiomas.length === 0) return null;

    const item = this.idiomas.find((t) => +t.IdiomaId === +id);
    return item?.Idioma || null;
  }
  //#endregion Buscar Dato

  regresar() {
    this.navigationService.goBack();
  }

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    origen: { required: 'El campo Origen es requerido.' },
    genero: { required: 'El campo Género es requerido.' },
    inicio: {
      required: 'El campo Inicio es requerido.',
      fechaFutura: 'La Fecha Inicio no puede ser una fecha futura.',
    },
    fin: {
      finMayorQueinicio: 'La Fecha Inicio debe ser posterior a la Fecha Fin.',
      fechaFutura: 'La Fecha Fin no puede ser una fecha futura.',
    },
    sellos: { required: 'El campo Sellos es requerido.' },
    estatusId: {
      required: 'El campo Estatus es requerido.',
      noCero: 'Debes seleccionar un Estatus',
    },
    sitioWeb: {
      required: 'El campo Sitio Web es requerido.',
      urlInvalida: 'El sitio web debe ser una URL válida.',
    },
    idiomaId: {
      required: 'El campo Idioma es requerido.',
      noCero: 'Debes seleccionar un Idioma',
    },
    logo: {
      required: 'El campo Logo es requerido.',
      urlInvalida: 'El logo debe ser una URL válida.',
      pattern: 'El logo debe ser una imagen (png, jpg, jpeg, webp).',
    },
  };

  getError(controlName: keyof typeof this.errorMessages): string | null {
    return FormValidationUtils.getErrorMessage(
      this.form.get(controlName),
      this.errorMessages[controlName],
    );
  }
  //#endregion Error Msj

  get sitioWeb() {
    return this.form.get('sitioWeb');
  }
}
