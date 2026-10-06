import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { ArtistaService } from '@shared/services/artista.service';
import { ReportesService } from '@core/services/reportes.service';
import { ArtistaResponse } from '@shared/models/artista';

@Component({
  selector: 'app-artista-list',
  standalone: false,
  templateUrl: './artista-list.html',
  styleUrl: './artista-list.css',
})
export class ArtistaList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Artistas';
  displayedColumns: string[] = [
    'artistaId',
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
    'acciones',
  ];

  dataSource = new MatTableDataSource<ArtistaResponse>();
  total: number = 0;

  artistas: ArtistaResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearArtista = false;
  puedeCrearInstrumentoArtistaGrupo = false;

  puedeEditarArtista = false;

  puedeEliminarArtista = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ArtistaService,
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
    this.puedeCrearArtista = this.permiso.puedeCrear(Seccion.Artista);
    this.puedeCrearInstrumentoArtistaGrupo = this.permiso.puedeCrear(
      Seccion.InstrumentoArtistaGrupo,
    );

    this.puedeEditarArtista = this.permiso.puedeEditar(Seccion.Artista);

    this.puedeEliminarArtista = this.permiso.puedeEliminar(Seccion.Artista);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarArtista(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.artistas = res;
          this.dataSource.data = this.artistas;
          this.total = this.artistas.length > 0 ? this.artistas[0].totalRegistros : 0;
        } else {
          this.artistas = [];
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
    this.alerta.reporte(this.archivo);
    this.service.exportarExcel().subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.archivo);
    });
  }
}
