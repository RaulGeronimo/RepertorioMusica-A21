import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '@core/services/alertas.service';

import { InstrumentoArtista } from '@shared/models/instrumento-artista';
import { InstrumentoArtistaService } from '@shared/services/instrumento-artista.service';

import { InstrumentoService } from '@shared/services/instrumento.service';
import { ArtistaGrupoService } from '@shared/services/artista-grupo.service';
import { InstrumentoResponse } from '@shared/models/instrumento';
import { ArtistaGrupoResponse } from '@shared/models/artista-grupo';
import { NavigationService } from '@core/services/navigation.service';

import { noCeroValidator } from '@shared/validators/number.validators';
import { FormValidationUtils } from '@shared/utils/form-validation.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-instrumento-artista-form',
  standalone: false,
  templateUrl: './instrumento-artista-form.html',
  styleUrl: './instrumento-artista-form.css',
})
export class InstrumentoArtistaForm {
  form: FormGroup;

  instrumentoArtista: InstrumentoArtista = {
    instrumentoArtistaGrupoId: 0,
    artistaId: 0,
    instrumentoId: 0,
  };

  edit: boolean = false;

  artistas: ArtistaGrupoResponse[] = [];
  instrumentos: InstrumentoResponse[] = [];

  search: any;

  constructor(
    private service: InstrumentoArtistaService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService,
    private navigationService: NavigationService,

    private instrumentoService: InstrumentoService,
    private artistaGrupoService: ArtistaGrupoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      artistaId: [this.instrumentoArtista.artistaId || 0, [Validators.required, noCeroValidator()]],
      instrumentoId: [
        this.instrumentoArtista.instrumentoId || 0,
        [Validators.required, noCeroValidator()],
      ],
    });
  }

  ngOnInit(): void {
    this.obtenerDatos();
    const params = this.activatedRoute.snapshot.params;

    if (params['id']) {
      this.service.getById(params['id']).subscribe({
        next: (res) => {
          this.instrumentoArtista = res;
          this.edit = true;

          this.form.patchValue({
            ...this.instrumentoArtista,
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
    this.obtenerInstrumento();
  }

  add() {
    const request: InstrumentoArtista = {
      ...this.instrumentoArtista,
      ...this.form.value,
    };

    this.service.create(request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.successtroast('El instrumento fue agregado con éxito', 'Instrumento Agregado');
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al registrar');
      },
    });
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    const request: InstrumentoArtista = {
      ...this.instrumentoArtista,
      ...this.form.value,
    };

    this.service.update(params['id'], request).subscribe({
      next: () => {
        this.regresar();
        this.alerta.infotroast(
          'El instrumento fue actualizado con éxito',
          'Instrumento Actualizado',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.alerta.manejarError(err, 'Error al actualizar');
      },
    });
  }

  //#region Otras Tablas
  obtenerArtista() {
    this.artistaGrupoService.getLista().subscribe({
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

  obtenerInstrumento() {
    this.instrumentoService.getLista().subscribe({
      next: (res) => {
        this.instrumentos = res;
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

    const item = this.artistas.find((t) => +t.artistaGrupoId === +id);
    return item?.nombreArtistico || null;
  }

  getNombreInstrumento(id: number): string | null {
    if (!id || !this.instrumentos || this.instrumentos.length === 0) return null;

    const item = this.instrumentos.find((t) => +t.instrumentoId === +id);
    return item?.nombre || null;
  }

  getNombreGrupo(id: number): string | null {
    if (!id || !this.artistas || this.artistas.length === 0) return null;

    const item = this.artistas.find((t) => +t.artistaGrupoId === +id);
    return item?.grupo || null;
  }

  getImagenArtista(id: number): string | null {
    if (!id || !this.artistas || this.artistas.length === 0) return null;

    const item = this.artistas.find((t) => +t.artistaGrupoId === +id);
    return item?.foto || null;
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

  refrescarInstrumentos() {
    this.obtenerInstrumento();
    this.alerta.successtroast('Lista de instrumentos actualizada', 'Actualizado');
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
    instrumentoId: {
      required: 'El campo Instrumento es requerido.',
      noCero: 'Debes seleccionar un Instrumento',
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
