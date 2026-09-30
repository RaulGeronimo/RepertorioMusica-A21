import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { ArtistaGrupoService } from '@shared/services/artista-grupo.service';
import { ReportesService } from '@core/services/reportes.service';
import { ArtistaGrupoResponse } from '@shared/models/artista-grupo';

@Component({
  selector: 'app-artista-grupo-list',
  standalone: false,
  templateUrl: './artista-grupo-list.html',
  styleUrl: './artista-grupo-list.css',
})
export class ArtistaGrupoList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  Archivo: string = 'Artistas';
  displayedColumns: string[] = [
    'artistaGrupoId',
    'nombre',
    'nombreArtistico',
    'grupo',
    'periodo',
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

  dataSource = new MatTableDataSource<ArtistaGrupoResponse>();
  total: number = 0;

  artistas: ArtistaGrupoResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearArtistaGrupo = false;
  puedeCrearInstrumentoArtistaGrupo = false;

  puedeEditarArtistaGrupo = false;

  puedeEliminarArtistaGrupo = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ArtistaGrupoService,
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
    this.puedeCrearArtistaGrupo = this.permiso.puedeCrear(Seccion.ArtistaGrupo);
    this.puedeCrearInstrumentoArtistaGrupo = this.permiso.puedeCrear(Seccion.InstrumentoArtistaGrupo);

    this.puedeEditarArtistaGrupo = this.permiso.puedeEditar(Seccion.ArtistaGrupo);

    this.puedeEliminarArtistaGrupo = this.permiso.puedeEliminar(Seccion.ArtistaGrupo);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarArtistaGrupo(id, () => this.obtenerLista());
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
    this.alerta.reporte(this.Archivo);
    this.service.exportarExcel().subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.Archivo);
    });
  }
}
