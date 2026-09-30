import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { CancionAlbumService } from '@shared/services/cancion-album.service';
import { ReportesService } from '@core/services/reportes.service';
import { CancionAlbumResponse } from '@shared/models/cancion-album';

@Component({
  selector: 'app-cancion-album-list',
  standalone: false,
  templateUrl: './cancion-album-list.html',
  styleUrl: './cancion-album-list.css',
})
export class CancionAlbumList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  Archivo: string = 'Canciones';
  displayedColumns: string[] = [
    'cancionAlbumId',
    'cancion',
    'album',
    'numero',
    'duracion',
    'publicacion',
    'genero',
    'interpretacion',
    'grupo',
    'acciones',
  ];

  dataSource = new MatTableDataSource<CancionAlbumResponse>();
  canciones: CancionAlbumResponse[] = [];

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;

  puedeEditarCancionAlbum = false;

  puedeEliminarCancionAlbum = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CancionAlbumService,
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
    this.puedeCrearCancion = this.permiso.puedeCrear(Seccion.Cancion);
    this.puedeCrearAlbum = this.permiso.puedeCrear(Seccion.Album);
    this.puedeCrearCancionAlbum = this.permiso.puedeCrear(Seccion.CancionAlbum);

    this.puedeEditarCancionAlbum = this.permiso.puedeEditar(Seccion.CancionAlbum);

    this.puedeEliminarCancionAlbum = this.permiso.puedeEliminar(Seccion.CancionAlbum);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarCancionAlbum(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.canciones = res;
          this.dataSource.data = this.canciones;
        } else {
          this.canciones = [];
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

  export() {
    this.alerta.reporte(this.Archivo);
    this.service.exportarExcel().subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.Archivo);
    });
  }
}
