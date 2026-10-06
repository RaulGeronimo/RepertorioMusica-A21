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
import { AlbumResponse } from '@shared/models/album';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-grupo-album',
  standalone: false,
  templateUrl: './grupo-album.html',
  styleUrl: './grupo-album.css',
})
export class GrupoAlbum implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Álbumes';

  displayedColumns: string[] = [
    'albumId',
    'nombre',
    'disquera',
    'canciones',
    'duracion',
    'lanzamiento',
    'grabacion',
    'acciones',
  ];

  dataSource = new MatTableDataSource<AlbumResponse>();
  total: number = 0;

  grupo!: GrupoResponse;
  albumes: AlbumResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;
  puedeCrearArtistaGrupo = false;

  puedeVerCancion = false;
  puedeVerCancionAlbum = false;
  puedeVerAlbum = false;
  puedeVerArtistaGrupo = false;

  puedeEditarGrupo = false;
  puedeEditarAlbum = false;

  puedeEliminarAlbum = false;
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

    this.puedeVerCancionAlbum = this.permiso.puedeVer(Seccion.CancionAlbum);
    this.puedeVerCancion = this.permiso.puedeVer(Seccion.Cancion);
    this.puedeVerAlbum = this.permiso.puedeVer(Seccion.Album);
    this.puedeVerArtistaGrupo = this.permiso.puedeVer(Seccion.ArtistaGrupo);

    this.puedeEditarGrupo = this.permiso.puedeEditar(Seccion.Grupo);
    this.puedeEditarAlbum = this.permiso.puedeEditar(Seccion.Album);

    this.puedeEliminarAlbum = this.permiso.puedeEliminar(Seccion.Album);
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
        this.alerta.successtroast(`Álbumes del grupo '${this.grupo.nombre}'`, 'Lista de Álbumes');
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  borrar(id: number) {
    this.alerta.borrarAlbum(id, () => this.obtenerLista());
  }

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getGrupoAlbumes(params['id']).subscribe({
      next: (res) => {
        if (res != null) {
          this.albumes = res;
          this.dataSource.data = this.albumes;
          this.cdr.markForCheck();
        } else {
          this.albumes = [];
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

    this.alerta.reporte(this.archivo);
    this.service.exportarExcelAlbum(params['id']).subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.archivo);
    });
  }

  regresar() {
    this.navigationService.goBack();
  }
}
