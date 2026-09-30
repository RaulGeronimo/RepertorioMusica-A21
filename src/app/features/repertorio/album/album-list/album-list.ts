import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { AlbumService } from '@shared/services/album.service';
import { ReportesService } from '@core/services/reportes.service';
import { AlbumResponse } from '@shared/models/album';

@Component({
  selector: 'app-album-list',
  standalone: false,
  templateUrl: './album-list.html',
  styleUrl: './album-list.css',
})
export class AlbumList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  Archivo: string = 'Albumes';
  displayedColumns: string[] = [
    'albumId',
    'nombre',
    'grupo',
    'disquera',
    'canciones',
    'duracion',
    'lanzamiento',
    'grabacion',
    'acciones',
  ];

  dataSource = new MatTableDataSource<AlbumResponse>();
  total: number = 0;

  albumes: AlbumResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;

  puedeEditarAlbum = false;

  puedeEliminarAlbum = false;

  puedeVerCancion = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: AlbumService,
    private alerta: AlertasService,
    public permiso: PermisosService,
    private reportes: ReportesService,
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
    this.puedeCrearAlbum = this.permiso.puedeCrear(Seccion.Album);
    this.puedeCrearCancionAlbum = this.permiso.puedeCrear(Seccion.CancionAlbum);

    this.puedeEditarAlbum = this.permiso.puedeEditar(Seccion.Album);

    this.puedeEliminarAlbum = this.permiso.puedeEliminar(Seccion.Album);

    this.puedeVerCancion = this.permiso.puedeVer(Seccion.Cancion);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarAlbum(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.albumes = res;
          this.dataSource.data = this.albumes;
          this.total = this.albumes.length > 0 ? this.albumes[0].totalRegistros : 0;
        } else {
          this.albumes = [];
          this.alerta.SinResultados();
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
    this.alerta.reporte(this.Archivo);
    this.service.exportarExcel().subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.Archivo);
    });
  }
}
