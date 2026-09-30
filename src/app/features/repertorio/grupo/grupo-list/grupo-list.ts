import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { GrupoService } from '@shared/services/grupo.service';
import { ReportesService } from '@core/services/reportes.service';
import { GrupoResponse } from '@shared/models/grupo';

@Component({
  selector: 'app-grupo-list',
  standalone: false,
  templateUrl: './grupo-list.html',
  styleUrl: './grupo-list.css',
})
export class GrupoList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  Archivo: string = 'Grupos';
  displayedColumns: string[] = [
    'grupoId',
    'nombre',
    'albumes',
    'canciones',
    'origen',
    'genero',
    'periodo',
    'sellos',
    'estatus',
    'idioma',
    'acciones',
  ];

  dataSource = new MatTableDataSource<GrupoResponse>();
  total: number = 0;

  grupos: GrupoResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearGrupo = false;
  puedeCrearArtistaGrupo = false;

  puedeEditarGrupo = false;

  puedeEliminarGrupo = false;

  puedeVerCancion = false;
  puedeVerArtistaGrupo = false;
  puedeVerAlbum = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: GrupoService,
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
    this.puedeCrearGrupo = this.permiso.puedeCrear(Seccion.Grupo);
    this.puedeCrearArtistaGrupo = this.permiso.puedeCrear(Seccion.ArtistaGrupo);

    this.puedeEditarGrupo = this.permiso.puedeEditar(Seccion.Grupo);

    this.puedeEliminarGrupo = this.permiso.puedeEliminar(Seccion.Grupo);

    this.puedeVerCancion = this.permiso.puedeVer(Seccion.Cancion);
    this.puedeVerArtistaGrupo = this.permiso.puedeVer(Seccion.ArtistaGrupo);
    this.puedeVerAlbum = this.permiso.puedeVer(Seccion.Album);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarGrupo(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.grupos = res;
          this.dataSource.data = this.grupos;
          this.total = this.grupos.length > 0 ? this.grupos[0].totalRegistros : 0;
        } else {
          this.grupos = [];
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
