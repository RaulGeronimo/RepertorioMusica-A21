import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { Artista } from '@shared/models/artista';
import { ArtistaService } from '@shared/services/artista.service';
import { CatalogosService } from '@core/services/catalogos.service';

import { PaisService } from '@shared/services/pais.service';
import { PaisResponse } from '@shared/models/pais';
import { GeneroResponse } from '@core/models/catalogos';
import { TipoVozResponse } from '@core/models/catalogos';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { fechaMayorQueValidator, limiteFecha } from '@shared/validators/date.validators';
import { formatearFechaInput } from '@shared/utils/date.utils';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { urlValidator } from '@shared/validators/url.validator';

@Component({
  selector: 'app-artista-form',
  standalone: false,
  templateUrl: './artista-form.html',
  styleUrl: './artista-form.css',
})
export class ArtistaForm implements OnInit {
  form: FormGroup;

  artista: Artista = {
    artistaId: 0,
    nombre: '',
    nombreArtistico: '',
    generoId: 0,
    fechaNacimiento: '',
    fechaFinado: '',
    estatura: '',
    paisId: 0,
    instrumentos: '',
    tipoVozId: 0,
    foto: '',
  };

  edit: boolean = false;

  generos: GeneroResponse[] = [];
  tipoVoces: TipoVozResponse[] = [];
  paises: PaisResponse[] = [];

  search: any;

  constructor(
    private service: ArtistaService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private catalogosService: CatalogosService,
    private paisService: PaisService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        nombreArtistico: ['', Validators.required],
        generoId: [this.artista.generoId || 0, [Validators.required, noCeroValidator()]],
        fechaNacimiento: ['', Validators.required],
        fechaFinado: [],
        estatura: ['', [Validators.required, Validators.min(1.5)]],
        paisId: [this.artista.paisId || 0, [Validators.required, noCeroValidator()]],
        instrumentos: ['', Validators.required],
        tipoVozId: [this.artista.tipoVozId || 0, [Validators.required, noCeroValidator()]],
        foto: [
          '',
          [
            Validators.required,
            urlValidator(),
            Validators.pattern('.*\\.(png|jpg|jpeg|webp)(\\?.*)?$'),
          ],
        ],
      },
      {
        validators: [
          fechaMayorQueValidator('fechaNacimiento', 'fechaFinado', false),
          limiteFecha('fechaNacimiento'),
          limiteFecha('fechaFinado'),
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
          this.artista = res;
          this.edit = true;

          this.form.patchValue({
            ...this.artista,
            fechaNacimiento: formatearFechaInput(this.artista.fechaNacimiento!),
            fechaFinado: formatearFechaInput(this.artista.fechaFinado!),
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
    this.obtenerGeneros();
    this.obtenerTiposVoz();
    this.obtenerPaises();
  }

  add() {
    const request: Artista = {
      ...this.artista,
      ...this.form.value,
      fechaFinado: this.form.value.fechaFinado || null,
    };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast(
          `El artista '${request.nombre}' fue agregado con éxito`,
          'Artista Agregado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: Artista = {
      ...this.artista,
      ...this.form.value,
      fechaFinado: this.form.value.fechaFinado || null,
    };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast(
          `El artista '${request.nombre}' fue actualizado con éxito`,
          'Artista Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Catalogos
  obtenerGeneros() {
    this.catalogosService.getGenero().subscribe({
      next: (res) => {
        this.generos = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  obtenerTiposVoz() {
    this.catalogosService.getTipoVoz().subscribe({
      next: (res) => {
        this.tipoVoces = res;
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
  getNombreGenero(id: number): string | null {
    if (!id || !this.generos || this.generos.length === 0) return null;

    const item = this.generos.find((t) => +t.GeneroId === +id);
    return item?.Genero || null;
  }

  getNombreTipoVoz(id: number): string | null {
    if (!id || !this.tipoVoces || this.tipoVoces.length === 0) return null;

    const item = this.tipoVoces.find((t) => +t.TipoVozId === +id);
    return item?.TipoVoz || null;
  }

  getNombrePais(id: number): string | null {
    if (!id || !this.paises || this.paises.length === 0) return null;

    const item = this.paises.find((t) => +t.paisId === +id);
    return item?.nacionalidad || null;
  }
  //#endregion Buscar Dato

  regresar() {
    this.navigationService.goBack();
  }

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
    nombreArtistico: { required: 'El campo Nombre Artistico es requerido.' },
    generoId: {
      required: 'El campo Género es requerido.',
      noCero: 'Debes seleccionar un Género',
    },
    fechaNacimiento: {
      required: 'El campo Fecha Nacimiento es requerido.',
      fechaFutura: 'La Fecha de Nacimiento no puede ser una fecha futura.',
    },
    fechaFinado: {
      fechaFinadoMayorQuefechaNacimiento:
        'La Fecha Finado debe ser posterior a la Fecha de Nacimiento.',
      fechaFutura: 'La Fecha de Cierre no puede ser una fecha futura.',
    },
    estatura: { required: 'El campo Estatura es requerido.' },
    paisId: {
      required: 'El campo País es requerido.',
      noCero: 'Debes seleccionar un País',
    },
    instrumentos: { required: 'El campo Instrumentos es requerido.' },
    tipoVozId: {
      required: 'El campo Tipo Voz es requerido.',
      noCero: 'Debes seleccionar un Tipo de Voz',
    },
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
