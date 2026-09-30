import { Component, OnInit, ViewChild, AfterViewInit, signal, computed } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioResponse } from '@core/models/usuario';
import { Permiso } from '@core/models/permiso';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService } from '@core/services/auth.service';
import { BitacoraService } from '@core/services/bitacora.service';
import { UsuariosService } from '@core/services/usuarios.service';
import { BitacoraCargaResponse, BitacoraErrorResponse } from '@core/models/bitacora';
import { ThemeService } from '@core/services/theme.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit, AfterViewInit {
  perfil = signal<UsuarioResponse>({} as UsuarioResponse);
  permisos: Permiso[] = [];

  BitacoraC: BitacoraCargaResponse[] = [];
  BitacoraE: BitacoraErrorResponse[] = [];

  TotalCorrectos = signal<number>(0);
  TotalError = signal<number>(0);
  TotalAgregados = signal<number>(0);
  TotalActualizados = signal<number>(0);
  TotalEliminados = signal<number>(0);

  displayedColumns: string[] = ['seccion', 'crear', 'editar', 'eliminar', 'ver'];
  dataSource = new MatTableDataSource<Permiso>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  movimientos: { operacion: string; entidad: string; fecha: Date }[] = [];
  displayedColumnsMov: string[] = ['operacion', 'entidad', 'fecha'];
  dataSourceMov = new MatTableDataSource<{
    operacion: string;
    entidad: string;
    fecha: Date;
  }>();

  // Color de leyenda derivado del tema
  private colorLeyenda = computed(() =>
    this.themeService.temaActual() === 'dark' ? '#ffffff' : '#212529',
  );

  // Gráficas -> computed(), no propiedades planas reasignadas por un effect
  actividadChart = computed(() => ({
    labels: ['Cargas Exitosas', 'Errores'],
    datasets: [
      {
        data: [this.TotalCorrectos(), this.TotalError()],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 2,
      },
    ],
  }));

  actividadChartOptions = computed<ChartConfiguration<'doughnut'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: this.colorLeyenda() } },
      tooltip: { enabled: true },
    },
  }));

  movimientosChart = computed(() => ({
    labels: ['Agregados', 'Actualizados', 'Eliminados'],
    datasets: [
      {
        data: [this.TotalAgregados(), this.TotalActualizados(), this.TotalEliminados()],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
        borderWidth: 2,
      },
    ],
  }));

  movimientosChartOptions = computed<ChartConfiguration<'doughnut'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: this.colorLeyenda() } },
      tooltip: { enabled: true },
    },
  }));

  constructor(
    private service: AuthService,
    private userService: UsuariosService,
    private alerta: AlertasService,
    private bitacoraService: BitacoraService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();

    this.userService.getUsuario().subscribe({
      next: (res) => {
        this.perfil.set(res);
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });

    this.permisos = this.service.obtenerPermisos() ?? [];
    this.dataSource.data = this.permisos;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerDatos() {
    this.obtenerBitacoraCarga();
    this.obtenerBitacoraError();
  }

  obtenerBitacoraCarga() {
    this.bitacoraService.getBitacoraCargaUsuario().subscribe({
      next: (res) => {
        this.BitacoraC = res || [];

        this.TotalCorrectos.set(this.BitacoraC[0]?.totalRegistros ?? this.BitacoraC.length);

        this.TotalAgregados.set(
          this.BitacoraC.filter((x: any) => x.proceso?.toLowerCase().includes('agregad')).length,
        );

        this.TotalActualizados.set(
          this.BitacoraC.filter((x: any) => x.proceso?.toLowerCase().includes('actualizad')).length,
        );

        this.TotalEliminados.set(
          this.BitacoraC.filter((x: any) => x.proceso?.toLowerCase().includes('eliminad')).length,
        );

        this.movimientos = this.BitacoraC.map((x: any) => ({
          operacion: x.operacion,
          entidad: x.entidad,
          fecha: x.fecha ? new Date(x.fecha) : new Date(),
        }));

        this.dataSourceMov.data = this.movimientos;
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  obtenerBitacoraError() {
    this.bitacoraService.getBitacoraErrorUsuario().subscribe({
      next: (res) => {
        this.BitacoraE = res;
        this.TotalError.set(this.BitacoraE[0]?.totalRegistros ?? 0);
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }
}
