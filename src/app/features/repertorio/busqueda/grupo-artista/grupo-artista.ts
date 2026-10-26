import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from '@environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { BusquedaService } from '@shared/services/busqueda.service';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '@core/services/reportes.service';

import { GrupoResponse } from '@shared/models/grupo';
import { ArtistaGrupoResponse } from '@shared/models/artista-grupo';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-grupo-artista',
  standalone: false,
  templateUrl: './grupo-artista.html',
  styleUrl: './grupo-artista.css',
})
export class GrupoArtista implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = '';

  displayedColumns: string[] = [
    'artistaGrupoId',
    'nombre',
    'nombreArtistico',
    'genero',
    'fechaNacimiento',
    'fechaFinado',
    'edad',
    'estatura',
    'pais',
    'instrumentos',
    'tipoVoz',
    'periodo',
    'acciones',
  ];

  dataSource = new MatTableDataSource<ArtistaGrupoResponse>();
  total: number = 0;

  grupo!: GrupoResponse;
  artistas: ArtistaGrupoResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;
  puedeCrearArtistaGrupo = false;
  puedeCrearInstrumentoArtistaGrupo = false;

  puedeVerCancion = false;
  puedeVerCancionAlbum = false;
  puedeVerAlbum = false;
  puedeVerArtistaGrupo = false;

  puedeEditarGrupo = false;
  puedeEditarArtistaGrupo = false;

  puedeEliminarArtistaGrupo = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: BusquedaService,
    private alerta: AlertasService,
    public permiso: PermisosService,
    private reportes: ReportesService,
    private navigationService: NavigationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerPermiso();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  obtenerPermiso() {
    this.puedeCrearCancion = this.permiso.puedeCrear(Seccion.Cancion);
    this.puedeCrearAlbum = this.permiso.puedeCrear(Seccion.Album);
    this.puedeCrearCancionAlbum = this.permiso.puedeCrear(Seccion.CancionAlbum);
    this.puedeCrearArtistaGrupo = this.permiso.puedeCrear(Seccion.ArtistaGrupo);
    this.puedeCrearInstrumentoArtistaGrupo = this.permiso.puedeCrear(
      Seccion.InstrumentoArtistaGrupo,
    );

    this.puedeVerCancionAlbum = this.permiso.puedeVer(Seccion.CancionAlbum);
    this.puedeVerCancion = this.permiso.puedeVer(Seccion.Cancion);
    this.puedeVerAlbum = this.permiso.puedeVer(Seccion.Album);
    this.puedeVerArtistaGrupo = this.permiso.puedeVer(Seccion.ArtistaGrupo);

    this.puedeEditarGrupo = this.permiso.puedeEditar(Seccion.Grupo);
    this.puedeEditarArtistaGrupo = this.permiso.puedeEditar(Seccion.ArtistaGrupo);

    this.puedeEliminarArtistaGrupo = this.permiso.puedeEliminar(Seccion.ArtistaGrupo);
  }

  obtenerDatos() {
    this.obtenerGrupo();
    this.obtenerLista();
  }

  obtenerGrupo() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getGrupoId(params['id']).subscribe({
      next: (res) => {
        this.grupo = res;
        this.alerta.successtroast(
          `Integrantes del grupo '${this.grupo.nombre}'`,
          'Lista de Integrantes',
        );
        this.archivo = this.grupo.nombre;

        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  borrar(id: number) {
    this.alerta.borrarArtistaGrupo(id, () => this.obtenerLista());
  }

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getGrupoIntegrantes(params['id']).subscribe({
      next: (res) => {
        if (res != null) {
          this.artistas = res;
          this.dataSource.data = this.artistas;
          this.cdr.markForCheck();
        } else {
          this.artistas = [];
        }
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambiarVista() {
    this.tabla = !this.tabla;

    if (this.tabla) {
      this.search = '';
    } else {
      this.dataSource.filter = '';
    }
  }

  export() {
    const params = this.activatedRoute.snapshot.params;

    this.service.exportarExcelGrupo(params['id']).subscribe({
      next: (blob) => {
        this.reportes.descargarExcel(blob, this.archivo);
        this.alerta.reporte(this.archivo);
      },
      error: (err) => this.alerta.errorReporte(err, (e) => this.reportes.leerErrorBlob(e)),
    });
  }

  regresar() {
    this.navigationService.goBack();
  }
}
