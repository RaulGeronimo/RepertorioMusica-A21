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

import { AlbumResponse } from '@shared/models/album';
import { CancionAlbumResponse } from '@shared/models/cancion-album';
import { NavigationService } from '@core/services/navigation.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-album-cancion',
  standalone: false,
  templateUrl: './album-cancion.html',
  styleUrl: './album-cancion.css',
})
export class AlbumCancion implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Canciones';

  displayedColumns: string[] = [
    'numero',
    'nombre',
    'duracion',
    'publicacion',
    'genero',
    'reproducir',
  ];

  dataSource = new MatTableDataSource<CancionAlbumResponse>();

  album!: AlbumResponse;
  canciones: CancionAlbumResponse[] = [];

  //#region Permisos
  puedeCrearCancion = false;
  puedeCrearAlbum = false;
  puedeCrearCancionAlbum = false;
  puedeCrearArtistaGrupo = false;

  puedeEditarAlbum = false;
  //#endregion Permisos

  cancionActiva: CancionAlbumResponse | null = null;
  spotifyActivo: string | null = null;
  urlSpotify: SafeResourceUrl | null = null;

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
    this.puedeCrearArtistaGrupo = this.permiso.puedeCrear(Seccion.ArtistaGrupo);

    this.puedeEditarAlbum = this.permiso.puedeEditar(Seccion.Album);
  }

  obtenerDatos() {
    this.obtenerAlbum();
    this.obtenerLista();
  }

  obtenerAlbum() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getAlbumId(params['id']).subscribe({
      next: (res) => {
        this.album = res;
        this.alerta.successtroast(
          `Canciones del álbum '${this.album.nombre}'`,
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

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;

    this.service.getAlbumCanciones(params['id']).subscribe({
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

    this.alerta.reporte(this.archivo);
    this.service.exportarExcelAlbum(params['id']).subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.archivo);
    });
  }

  regresar() {
    this.navigationService.goBack();
  }

  //#region Spotify
  ids(c: CancionAlbumResponse): string[] {
    return (c.spotifyId ?? '').split(',');
  }

  reproducir(c: CancionAlbumResponse, id: string) {
    if (!id) return;

    if (this.spotifyActivo === id) {
      this.cerrarReproductor();
      return;
    }

    this.cancionActiva = c;
    this.spotifyActivo = id;
    this.urlSpotify = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://open.spotify.com/embed/track/${id}`,
    );
  }

  cerrarReproductor() {
    this.cancionActiva = null;
    this.spotifyActivo = null;
    this.urlSpotify = null;
  }
  //#endregion Spotify
}
