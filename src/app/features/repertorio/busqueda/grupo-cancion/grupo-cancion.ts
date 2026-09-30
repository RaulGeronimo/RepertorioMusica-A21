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
import { CancionResponse } from '@shared/models/cancion';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-grupo-cancion',
  standalone: false,
  templateUrl: './grupo-cancion.html',
  styleUrl: './grupo-cancion.css',
})
export class GrupoCancion implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  Archivo: string = 'Canciones';

  displayedColumns: string[] = [
    'cancionId',
    'nombre',
    'albumes',
    'duracion',
    'publicacion',
    'genero',
    'interpretacion',
    'acciones',
  ];

  dataSource = new MatTableDataSource<CancionResponse>();

  grupo!: GrupoResponse;
  canciones: CancionResponse[] = [];

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;
  puedeCrearArtistaGrupo = false;

  puedeVerCancion = false;
  puedeVerAlbum = false;
  puedeVerArtistaGrupo = false;

  puedeEditarGrupo = false;
  puedeEditarCancion = false;

  puedeEliminarCancion = false;
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

    this.puedeVerCancion = this.permiso.puedeVer(Seccion.Cancion);
    this.puedeVerAlbum = this.permiso.puedeVer(Seccion.Album);
    this.puedeVerArtistaGrupo = this.permiso.puedeVer(Seccion.ArtistaGrupo);

    this.puedeEditarGrupo = this.permiso.puedeEditar(Seccion.Grupo);
    this.puedeEditarCancion = this.permiso.puedeEditar(Seccion.Cancion);

    this.puedeEliminarCancion = this.permiso.puedeEliminar(Seccion.Cancion);
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
          `Canciones del grupo '${this.grupo.nombre}'`,
          'Lista de Canciones',
        );
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  borrar(id: number) {
    this.alerta.borrarCancion(id, () => this.obtenerLista());
  }

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getGrupoCanciones(params['id']).subscribe({
      next: (res) => {
        if (res != null) {
          this.canciones = res;
          this.dataSource.data = this.canciones;
          this.cdr.markForCheck();
        } else {
          this.canciones = [];
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

  export() {
    const params = this.activatedRoute.snapshot.params;

    this.alerta.reporte(this.Archivo);
    this.service.exportarExcelAlbum(params['id']).subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.Archivo);
    });
  }

  regresar() {
    this.navigationService.goBack();
  }
}
