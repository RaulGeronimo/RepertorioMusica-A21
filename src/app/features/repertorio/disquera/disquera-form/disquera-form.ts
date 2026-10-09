import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Disquera } from '@shared/models/disquera';
import { DisqueraService } from '@shared/services/disquera.service';

import { CatalogosService } from '@core/services/catalogos.service';
import { PaisService } from '@shared/services/pais.service';
import { EstatusResponse } from '@core/models/catalogos';
import { PaisResponse } from '@shared/models/pais';

import { noCeroValidator } from '@shared/validators/number.validators';
import { limiteFecha } from '@shared/validators/date.validators';
import { urlValidator } from '@shared/validators/url.validator';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-disquera-form',
  standalone: false,
  templateUrl: './disquera-form.html',
  styleUrl: './disquera-form.css',
})
export class DisqueraForm implements OnInit {
  form: FormGroup;

  disquera: Disquera = {
    disqueraId: 0,
    nombre: '',
    fundacion: '',
    fundador: '',
    generos: '',
    paisId: 0,
    estatusId: 1,
    logo: '',
  };

  edit: boolean = false;

  paises: PaisResponse[] = [];
  estatus: EstatusResponse[] = [];

  search: any;

  constructor(
    private service: DisqueraService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private router: Router,

    private catalogosService: CatalogosService,
    private paisService: PaisService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        fundacion: ['', Validators.required],
        fundador: ['', Validators.required],
        generos: ['', Validators.required],
        paisId: [this.disquera.paisId || 0, [Validators.required, noCeroValidator()]],
        estatusId: [this.disquera.estatusId || 0, [Validators.required, noCeroValidator()]],
        logo: [
          this.disquera.logo || '',
          [
            Validators.required,
            urlValidator(),
            Validators.pattern('.*\\.(png|jpg|jpeg|webp)(\\?.*)?$'),
          ],
        ],
      },
      {
        validators: [limiteFecha('fundacion')],
      },
    );
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.disquera = res;
          this.edit = true;

          this.form.patchValue({
            ...this.disquera,
            fundacion: formatearFechaInput(this.disquera.fundacion!),
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
    this.obtenerPaises();
  }

  add() {
    const request: Disquera = { ...this.disquera, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
        this.alerta.successtroast(
          `La disquera '${request.nombre}' fue agregada con éxito`,
          'Disquera Agregada',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Disquera = { ...this.disquera, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        this.alerta.infotroast(
          `La disquera '${request.nombre}' fue actualizada con éxito`,
          'Disquera Actualizada',
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
  //#endregion Catalogos

  //#region Otras Tablas
  obtenerPaises() {
    this.paisService.getLista().subscribe({
      next: (res) => {
        this.paises = res;
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
  getNombreEstatus(id: number): string | null {
    if (!id || !this.estatus || this.estatus.length === 0) return null;

    const item = this.estatus.find((t) => +t.EstatusId === +id);
    return item?.Estatus || null;
  }

  getNombrePais(id: number): string | null {
    if (!id || !this.paises || this.paises.length === 0) return null;

    const item = this.paises.find((t) => +t.paisId === +id);
    return item?.nacionalidad || null;
  }
  //#endregion Buscar Dato

  //#region Refresh
  refrescarPaises() {
    this.obtenerPaises();
    this.alerta.successtroast('Lista de paises actualizada', 'Actualizado');
  }
  //#endregion Refresh

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    fundacion: {
      required: 'El campo Fundación es requerido.',
      fechaFutura: 'La Fecha de Fundación no puede ser una fecha futura.',
    },
    fundador: { required: 'El campo Fundador es requerido.' },
    generos: { required: 'El campo Géneros es requerido.' },
    paisId: {
      required: 'El campo País es requerido.',
      noCero: 'Debes seleccionar un País',
    },
    estatusId: {
      required: 'El campo Estatus es requerido.',
      noCero: 'Debes seleccionar un Estatus',
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
}
