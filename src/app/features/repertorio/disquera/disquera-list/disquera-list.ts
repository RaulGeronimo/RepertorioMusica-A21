import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { DisqueraService } from '@shared/services/disquera.service';
import { ReportesService } from '@core/services/reportes.service';
import { DisqueraResponse } from '@shared/models/disquera';

@Component({
  selector: 'app-disquera-list',
  standalone: false,
  templateUrl: './disquera-list.html',
  styleUrl: './disquera-list.css',
})
export class DisqueraList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Disqueras';
  displayedColumns: string[] = [
    'disqueraId',
    'nombre',
    'fundacion',
    'fundador',
    'generos',
    'pais',
    'estatus',
    'acciones',
  ];

  dataSource = new MatTableDataSource<DisqueraResponse>();
  total: number = 0;

  disqueras: DisqueraResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearDisquera = false;

  puedeEditarDisquera = false;

  puedeEliminarDisquera = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: DisqueraService,
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
    this.puedeCrearDisquera = this.permiso.puedeCrear(Seccion.Disquera);

    this.puedeEditarDisquera = this.permiso.puedeEditar(Seccion.Disquera);

    this.puedeEliminarDisquera = this.permiso.puedeEliminar(Seccion.Disquera);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarDisquera(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.disqueras = res;
          this.dataSource.data = this.disqueras;
          this.total = this.disqueras.length > 0 ? this.disqueras[0].totalRegistros : 0;
        } else {
          this.disqueras = [];
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