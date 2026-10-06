import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Instrumento } from '@shared/models/instrumento';
import { InstrumentoService } from '@shared/services/instrumento.service';

import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { urlValidator } from '@shared/validators/url.validator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-instrumento-form',
  standalone: false,
  templateUrl: './instrumento-form.html',
  styleUrl: './instrumento-form.css',
})
export class InstrumentoForm implements OnInit {
  form: FormGroup;

  instrumento: Instrumento = {
    instrumentoId: 0,
    nombre: '',
    descripcion: '',
    foto: '',
  };

  edit: boolean = false;

  constructor(
    private service: InstrumentoService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private router: Router,

    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      foto: [
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
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.instrumento = res;
          this.edit = true;

          this.form.patchValue({ ...this.instrumento });
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

  add() {
    const request: Instrumento = { ...this.instrumento, ...this.form.value };

    this.service.create(request).subscribe({
      next: () => {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
        this.alerta.successtroast(
          `El instrumento '${request.nombre}' fue agregado con éxito`,
          'Instrumento Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Instrumento = { ...this.instrumento, ...this.form.value };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        this.alerta.infotroast(
          `El instrumento '${request.nombre}' fue actualizado con éxito`,
          'Instrumento Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Error Msj
  getValidationClasses(controlName: string) {
    return FormValidationUtils.getValidationClasses(this.form.get(controlName));
  }

  private readonly errorMessages = {
    nombre: { required: 'El campo Nombre es requerido.' },
    descripcion: { required: 'El campo Descripción es requerido.' },
    foto: {
      required: 'El campo Foto es requerido.',
      urlInvalida: 'La foto debe ser una URL válida.',
      pattern: 'La foto debe ser una imagen (png, jpg, jpeg, webp).',
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
