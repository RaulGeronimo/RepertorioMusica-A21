import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Pais } from '@shared/models/pais';
import { PaisService } from '@shared/services/pais.service';

import { CatalogosService } from '@core/services/catalogos.service';
import { ContinenteResponse } from '@core/models/catalogos';

import { noCeroValidator } from '@shared/validators/number.validators';
import { urlValidator } from '@shared/validators/url.validator';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pais-form',
  standalone: false,
  templateUrl: './pais-form.html',
  styleUrl: './pais-form.css',
})
export class PaisForm {
  form: FormGroup;

  pais: Pais = {
    paisId: 0,
    nombre: '',
    nacionalidad: '',
    continenteId: 0,
    bandera: '',
  };

  edit: boolean = false;

  continentes: ContinenteResponse[] = [];

  constructor(
    private service: PaisService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private router: Router,

    private catalogosService: CatalogosService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      continenteId: [this.pais.continenteId || 0, [Validators.required, noCeroValidator()]],
      bandera: [
        '',
        [
          Validators.required,
          urlValidator(),
          Validators.pattern('.*\\.(png|jpg|jpeg|webp|svg)(\\?.*)?$'),
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
          this.pais = res;
          this.edit = true;

          this.form.patchValue({ ...this.pais });
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
    this.obtenerContinente();
  }

  add() {
    const request: Pais = { ...this.pais, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
        this.alerta.successtroast(
          `El país '${request.nombre}' fue agregado con éxito`,
          'País Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Pais = { ...this.pais, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        this.alerta.infotroast(
          `El país '${request.nombre}' fue actualizado con éxito`,
          'País Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Catalogos
  obtenerContinente() {
    this.catalogosService.getContinente().subscribe({
      next: (res) => {
        this.continentes = res;
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
  getNombreContinente(id: number): string | null {
    if (!id || !this.continentes || this.continentes.length === 0) return null;

    const item = this.continentes.find((t) => +t.ContinenteId === +id);
    return item?.Continente || null;
  }
  //#endregion Buscar Dato

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    nacionalidad: { required: 'El campo Nacionalidad es requerido.' },
    continenteId: {
      required: 'El campo Continente es requerido.',
      noCero: 'Debes seleccionar un Continente',
    },
    bandera: {
      required: 'El campo Bandera es requerido.',
      urlInvalida: 'La Bandera debe ser una URL válida.',
      pattern: 'La Bandera debe ser una imagen (png, jpg, jpeg, webp).',
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
