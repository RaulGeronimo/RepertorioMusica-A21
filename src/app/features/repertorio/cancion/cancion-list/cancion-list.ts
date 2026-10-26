import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { CancionService } from '@shared/services/cancion.service';
import { ReportesService } from '@core/services/reportes.service';
import { CancionResponse } from '@shared/models/cancion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cancion-list',
  standalone: false,
  templateUrl: './cancion-list.html',
  styleUrl: './cancion-list.css',
})
export class CancionList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Canciones';
  displayedColumns: string[] = [
    'cancionId',
    'nombre',
    'grupo',
    'albumes',
    'duracion',
    'publicacion',
    'genero',
    'interpretacion',
    'reproducir',
    'acciones',
  ];

  dataSource = new MatTableDataSource<CancionResponse>();
  canciones: CancionResponse[] = [];

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;

  puedeEditarCancion = false;

  puedeEliminarCancion = false;
  //#endregion Permisos

  cancionActiva: CancionResponse | null = null;
  urlSpotify: SafeResourceUrl | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CancionService,
    private alerta: AlertasService,
    public permiso: PermisosService,
    private reportes: ReportesService,
    private sanitizer: DomSanitizer,
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

    this.puedeEditarCancion = this.permiso.puedeEditar(Seccion.Cancion);

    this.puedeEliminarCancion = this.permiso.puedeEliminar(Seccion.Cancion);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarCancion(id, () => this.obtenerLista());
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
    this.service.exportarExcel().subscribe({
      next: (blob) => {
        this.reportes.descargarExcel(blob, this.archivo);
        this.alerta.reporte(this.archivo);
      },
      error: (err) => this.alerta.errorReporte(err, (e) => this.reportes.leerErrorBlob(e)),
    });
  }

  //#region Spotify
  reproducir(c: CancionResponse) {
    if (!c.spotifyId) return;

    if (this.cancionActiva?.cancionId === c.cancionId) {
      this.cerrarReproductor();
      return;
    }

    this.cancionActiva = c;
    this.urlSpotify = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://open.spotify.com/embed/track/${c.spotifyId}`,
    );
  }

  cerrarReproductor() {
    this.cancionActiva = null;
    this.urlSpotify = null;
  }
  //#endregion Spotify
}
