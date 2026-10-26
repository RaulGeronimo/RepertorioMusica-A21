import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BitacoraErrorResponse } from '@core/models/bitacora';
import { AlertasService } from '@core/services/alertas.service';
import { BitacoraService } from '@core/services/bitacora.service';
import { ReportesService } from '@core/services/reportes.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bitacora-error',
  standalone: false,
  templateUrl: './bitacora-error.html',
  styleUrl: './bitacora-error.css',
})
export class BitacoraError implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Bitacora Error';

  displayedColumns: string[] = [
    'bitacoraErrorId',
    'usuario',
    'fecha',
    'tabla',
    'columna',
    'mensaje',
  ];

  dataSource = new MatTableDataSource<BitacoraErrorResponse>();
  bitacora: BitacoraErrorResponse[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: BitacoraService,
    private alerta: AlertasService,
    private reportes: ReportesService,
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    setTimeout(() => {
      this.sort.active = 'bitacoraErrorId';
      this.sort.direction = 'desc';

      this.sort.sortChange.emit({
        active: this.sort.active,
        direction: this.sort.direction,
      });
    });
  }

  obtenerDatos() {
    this.obtenerLista();
  }

  obtenerLista() {
    this.service.getBitacoraError().subscribe({
      next: (res) => {
        if (res != null) {
          this.bitacora = res;
          this.dataSource.data = this.bitacora;
        } else {
          this.bitacora = [];
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
    this.service.exportarExcelError().subscribe({
      next: (blob) => {
        this.reportes.descargarExcel(blob, this.archivo);
        this.alerta.reporte(this.archivo);
      },
      error: (err) => this.alerta.errorReporte(err, (e) => this.reportes.leerErrorBlob(e)),
    });
  }
}
