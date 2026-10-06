import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '@core/services/usuarios.service';
import { AlertasService } from '@core/services/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermisosService } from '@core/services/permisos.service';
import { environment } from '@environments/environment';
import { Seccion } from '@shared/enums/seccion';
import { CatalogosService } from '@core/services/catalogos.service';
import { Usuario, UsuarioResponse } from '@core/models/usuario';
import { AuthService } from '@core/services/auth.service';
import { ReportesService } from '@core/services/reportes.service';
import { RolResponse } from '@core/models/catalogos';

@Component({
  selector: 'app-usuario-list',
  standalone: false,
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
})
export class UsuarioList implements OnInit, AfterViewInit {
  pageSize: number = environment.registrosPagina;
  archivo: string = 'Usuarios';

  displayedColumns: string[] = [
    'usuarioId',
    'usuario',
    'correo',
    'nombre',
    'registro',
    'fechaNacimiento',
    'edad',
    'diasCumple',
    'rol',
    'activo',
  ];

  dataSource = new MatTableDataSource<UsuarioResponse>();

  usuarios: UsuarioResponse[] = [];
  user: Usuario;

  roles: RolResponse[] = [];

  //#region Permisos
  puedeEditarUsuarios = false;
  //#endregion Permisos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: UsuariosService,
    private userService: AuthService,
    private catalogo: CatalogosService,
    private alerta: AlertasService,
    public permiso: PermisosService,
    private reportes: ReportesService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.userService.obtenerDatosUsuario() ?? { usuario: '' };
  }

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerPermiso();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    setTimeout(() => {
      this.sort.active = 'usuario';
      this.sort.direction = 'asc';

      this.sort.sortChange.emit({
        active: this.sort.active,
        direction: this.sort.direction,
      });
    });
  }

  obtenerPermiso() {
    this.puedeEditarUsuarios = this.permiso.puedeEditar(Seccion.Usuarios);
  }

  obtenerDatos() {
    this.obtenerLista();
    this.obtenerRoles();
  }

  obtenerLista() {
    this.service.getUsuarios().subscribe({
      next: (res) => {
        if (res != null) {
          this.usuarios = res;
          this.dataSource.data = this.usuarios;
        } else {
          this.usuarios = [];
          this.alerta.SinResultados();
        }
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  //#region Catalogos
  obtenerRoles() {
    this.catalogo.getRol().subscribe({
      next: (res) => {
        this.roles = res;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }
  //#endregion Catalogos

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambiarEstado(usuario: any, nuevoEstado: boolean) {
    if (usuario.usuarioId === 1) {
      this.alerta.mostrarAlertaSimple(
        'Operación no permitida',
        'El usuario Admin no puede ser modificado.',
        'info',
      );
      return;
    }

    if (usuario.usuario === this.user.usuario) {
      this.alerta.mostrarAlertaSimple(
        'Operación no permitida',
        'No puedes modificar tu propio estado.',
        'info',
      );
      return;
    }

    const usuarioActualizado = { ...usuario, activo: nuevoEstado };

    this.service.update(usuario.usuarioId, usuarioActualizado).subscribe({
      next: () => {
        usuario.activo = nuevoEstado;
        this.alerta.mostrarAlertaSimple(
          'Usuario actualizado',
          `El usuario '${usuario.usuario}' ha sido ${nuevoEstado ? 'activado' : 'desactivado'}.`,
          'success',
        );
      },
      error: (err) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  cambiarRol(usuario: any, nuevoRolId: number) {
    if (usuario.usuarioId === 1) {
      this.alerta.mostrarAlertaSimple(
        'Operación no permitida',
        'El usuario Admin no puede cambiar de rol.',
        'info',
      );
      return;
    }

    if (usuario.usuario === this.user.usuario) {
      this.alerta.mostrarAlertaSimple(
        'Operación no permitida',
        'No puedes cambiar tu propio rol.',
        'info',
      );
      return;
    }

    const rolEncontrado = this.roles.find((r) => r.RolId === nuevoRolId);
    const nombreRol = rolEncontrado ? rolEncontrado.Rol : nuevoRolId;

    const usuarioActualizado = { ...usuario, rol: nuevoRolId };

    this.service.update(usuario.usuarioId, usuarioActualizado).subscribe({
      next: () => {
        usuario.rol = nuevoRolId;
        this.alerta.mostrarAlertaSimple(
          'Rol actualizado',
          `El usuario '${usuario.usuario}' ahora tiene el rol: ${nombreRol}.`,
          'success',
        );
      },
      error: (err) => {
        console.error(err);
        this.alerta.errorServidor();
      },
    });
  }

  export() {
    this.alerta.reporte(this.archivo);
    this.service.exportarExcel().subscribe((blob) => {
      this.reportes.descargarExcel(blob, this.archivo);
    });
  }
}
