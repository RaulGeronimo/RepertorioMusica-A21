import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from 'src/environments/environment';
import { Seccion } from '@shared/enums/seccion';

import { InstrumentoService } from '@shared/services/instrumento.service';
import { ReportesService } from '@core/services/reportes.service';
import { InstrumentoResponse } from '@shared/models/instrumento';

@Component({
  selector: 'app-instrumento-list',
  standalone: false,
  templateUrl: './instrumento-list.html',
  styleUrl: './instrumento-list.css',
})
export class InstrumentoList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Instrumentos';
  displayedColumns: string[] = ['instrumentoId', 'nombre', 'descripcion', 'acciones'];

  dataSource = new MatTableDataSource<InstrumentoResponse>();
  total: number = 0;

  instrumentos: InstrumentoResponse[] = [];
  search: any;
  show: boolean = false;
  tabla: boolean = false;

  //#region Permisos
  puedeCrearInstrumento = false;
  puedeEditarInstrumento = false;
  puedeEliminarInstrumento = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: InstrumentoService,
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
    this.puedeCrearInstrumento = this.permiso.puedeCrear(Seccion.Instrumento);
    this.puedeEditarInstrumento = this.permiso.puedeEditar(Seccion.Instrumento);
    this.puedeEliminarInstrumento = this.permiso.puedeEliminar(Seccion.Instrumento);
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  borrar(id: number) {
    this.alerta.borrarInstrumento(id, () => this.obtenerLista());
  }

  obtenerLista() {
    this.service.getLista().subscribe({
      next: (res) => {
        if (res != null) {
          this.instrumentos = res;
          this.dataSource.data = this.instrumentos;
          this.total = this.instrumentos.length > 0 ? this.instrumentos[0].totalRegistros : 0;
        } else {
          this.instrumentos = [];
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
    this.service.exportarExcel().subscribe({
      next: (blob) => {
        this.reportes.descargarExcel(blob, this.archivo);
        this.alerta.reporte(this.archivo);
      },
      error: (err) => this.alerta.errorReporte(err, (e) => this.reportes.leerErrorBlob(e)),
    });
  }
}
