import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { PaisService } from '@shared/services/pais.service';
import { ReportesService } from '@core/services/reportes.service';
import { PaisResponse } from '@shared/models/pais';

@Component({
  selector: 'app-pais-list',
  standalone: false,
  templateUrl: './pais-list.html',
  styleUrl: './pais-list.css',
})
export class PaisList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Paises';
  displayedColumns: string[] = ['paisId', 'nombre', 'nacionalidad', 'continente', 'acciones'];

  dataSource = new MatTableDataSource<PaisResponse>();
  total: number = 0;

  paises: PaisResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearPais = false;
  puedeEditarPais = false;
  puedeEliminarPais = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: PaisService,
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
    this.puedeCrearPais = this.permiso.puedeCrear(Seccion.Pais);
    this.puedeEditarPais = this.permiso.puedeEditar(Seccion.Pais);
    this.puedeEliminarPais = this.permiso.puedeEliminar(Seccion.Pais);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarPais(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.paises = res;
          this.dataSource.data = this.paises;
          this.total = this.paises.length > 0 ? this.paises[0].totalRegistros : 0;
        } else {
          this.paises = [];
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
