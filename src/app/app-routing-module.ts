import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//#region Login
import { authGuard } from '@core/guards/auth-guard';
import { noAuthGuard } from '@core/guards/no-auth-guard';
import { permisosGuard } from '@core/guards/permisos-guard';
import { Login } from '@features/auth/login/login';
import { Register } from '@features/auth/register/register';
import { ResetPassword } from '@features/auth/reset-password/reset-password';
//#endregion Login
import { Dashboard } from '@features/repertorio/dashboard/dashboard';
import { UsuarioList } from '@features/repertorio/usuarios/usuario-list/usuario-list';
import { Perfil } from '@features/repertorio/usuarios/perfil/perfil';
import { BitacoraCarga } from '@features/repertorio/bitacora/bitacora-carga/bitacora-carga';
import { BitacoraError } from '@features/repertorio/bitacora/bitacora-error/bitacora-error';
import { SinPermiso } from '@shared/components/sin-permiso/sin-permiso';
import { NotFound } from '@shared/components/not-found/not-found';

import { PaisList } from '@features/repertorio/pais/pais-list/pais-list';
import { PaisForm } from '@features/repertorio/pais/pais-form/pais-form';
import { InstrumentoList } from '@features/repertorio/instrumento/instrumento-list/instrumento-list';
import { InstrumentoForm } from '@features/repertorio/instrumento/instrumento-form/instrumento-form';
import { ArtistaList } from '@features/repertorio/artista/artista-list/artista-list';
import { ArtistaForm } from '@features/repertorio/artista/artista-form/artista-form';
import { GrupoList } from '@features/repertorio/grupo/grupo-list/grupo-list';
import { GrupoForm } from '@features/repertorio/grupo/grupo-form/grupo-form';
import { DisqueraList } from '@features/repertorio/disquera/disquera-list/disquera-list';
import { DisqueraForm } from '@features/repertorio/disquera/disquera-form/disquera-form';
import { AlbumList } from '@features/repertorio/album/album-list/album-list';
import { AlbumForm } from '@features/repertorio/album/album-form/album-form';
import { CancionList } from '@features/repertorio/cancion/cancion-list/cancion-list';
import { CancionForm } from '@features/repertorio/cancion/cancion-form/cancion-form';
import { ArtistaGrupoList } from '@features/repertorio/artista-grupo/artista-grupo-list/artista-grupo-list';
import { ArtistaGrupoForm } from '@features/repertorio/artista-grupo/artista-grupo-form/artista-grupo-form';
import { CancionAlbumList } from '@features/repertorio/cancion-album/cancion-album-list/cancion-album-list';
import { CancionAlbumForm } from '@features/repertorio/cancion-album/cancion-album-form/cancion-album-form';
import { InstrumentoArtistaList } from '@features/repertorio/instrumento-artista/instrumento-artista-list/instrumento-artista-list';
import { InstrumentoArtistaForm } from '@features/repertorio/instrumento-artista/instrumento-artista-form/instrumento-artista-form';
import { GrupoAlbum } from '@features/repertorio/busqueda/grupo-album/grupo-album';
import { GrupoCancion } from '@features/repertorio/busqueda/grupo-cancion/grupo-cancion';
import { GrupoArtista } from '@features/repertorio/busqueda/grupo-artista/grupo-artista';
import { AlbumCancion } from '@features/repertorio/busqueda/album-cancion/album-cancion';

const routes: Routes = [
  //#region Rutas Públicas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  {
    path: 'register',
    component: Register,
    canActivate: [noAuthGuard],
  },
  {
    path: 'reset',
    component: ResetPassword,
    canActivate: [noAuthGuard],
  },
  //#endregion Rutas Públicas

  //#region Rutas Protegidas
  {
    path: 'repertorio',
    component: Dashboard,
    canActivate: [authGuard], // Solo autenticación aquí
    canActivateChild: [permisosGuard], // Guard para todas las rutas hijas
    children: [
      { path: '', redirectTo: 'grupo', pathMatch: 'full' },

      //#region Bitácoras
      {
        path: 'bitacoraCarga',
        component: BitacoraCarga,
        data: { seccion: 'Bitácoras', permiso: 'puedeVer' },
      },
      {
        path: 'bitacoraError',
        component: BitacoraError,
        data: { seccion: 'Bitácoras', permiso: 'puedeVer' },
      },
      //#endregion Bitácoras

      //#region Usuarios
      {
        path: 'users',
        component: UsuarioList,
        data: { seccion: 'Usuarios', permiso: 'puedeVer' },
      },
      {
        path: 'profile',
        component: Perfil,
      },
      //#endregion Usuarios

      //#region Pais
      {
        path: 'pais',
        component: PaisList,
        data: { seccion: 'País', permiso: 'puedeVer' },
      },
      {
        path: 'pais/agregar',
        component: PaisForm,
        data: { seccion: 'País', permiso: 'puedeCrear' },
      },
      {
        path: 'pais/actualizar/:id',
        component: PaisForm,
        data: { seccion: 'País', permiso: 'puedeEditar' },
      },
      //#endregion Pais

      //#region Instrumento
      {
        path: 'instrumento',
        component: InstrumentoList,
        data: { seccion: 'Instrumento', permiso: 'puedeVer' },
      },
      {
        path: 'instrumento/agregar',
        component: InstrumentoForm,
        data: { seccion: 'Instrumento', permiso: 'puedeCrear' },
      },
      {
        path: 'instrumento/actualizar/:id',
        component: InstrumentoForm,
        data: { seccion: 'Instrumento', permiso: 'puedeEditar' },
      },
      //#endregion Instrumento

      //#region Artista
      {
        path: 'artista',
        component: ArtistaList,
        data: { seccion: 'Artista', permiso: 'puedeVer' },
      },
      {
        path: 'artista/agregar',
        component: ArtistaForm,
        data: { seccion: 'Artista', permiso: 'puedeCrear' },
      },
      {
        path: 'artista/actualizar/:id',
        component: ArtistaForm,
        data: { seccion: 'Artista', permiso: 'puedeEditar' },
      },
      //#endregion Artista

      //#region Grupo
      {
        path: 'grupo',
        component: GrupoList,
        data: { seccion: 'Grupo', permiso: 'puedeVer' },
      },
      {
        path: 'grupo/agregar',
        component: GrupoForm,
        data: { seccion: 'Grupo', permiso: 'puedeCrear' },
      },
      {
        path: 'grupo/actualizar/:id',
        component: GrupoForm,
        data: { seccion: 'Grupo', permiso: 'puedeEditar' },
      },
      //#endregion Grupo

      //#region Disquera
      {
        path: 'disquera',
        component: DisqueraList,
        data: { seccion: 'Disquera', permiso: 'puedeVer' },
      },
      {
        path: 'disquera/agregar',
        component: DisqueraForm,
        data: { seccion: 'Disquera', permiso: 'puedeCrear' },
      },
      {
        path: 'disquera/actualizar/:id',
        component: DisqueraForm,
        data: { seccion: 'Disquera', permiso: 'puedeEditar' },
      },
      //#endregion Disquera

      //#region Album
      {
        path: 'album',
        component: AlbumList,
        data: { seccion: 'Álbum', permiso: 'puedeVer' },
      },
      {
        path: 'album/agregar',
        component: AlbumForm,
        data: { seccion: 'Álbum', permiso: 'puedeCrear' },
      },
      {
        path: 'album/actualizar/:id',
        component: AlbumForm,
        data: { seccion: 'Álbum', permiso: 'puedeEditar' },
      },
      //#endregion Album

      //#region Cancion
      {
        path: 'cancion',
        component: CancionList,
        data: { seccion: 'Canción', permiso: 'puedeVer' },
      },
      {
        path: 'cancion/agregar',
        component: CancionForm,
        data: { seccion: 'Canción', permiso: 'puedeCrear' },
      },
      {
        path: 'cancion/actualizar/:id',
        component: CancionForm,
        data: { seccion: 'Canción', permiso: 'puedeEditar' },
      },
      //#endregion Cancion

      //#region ArtistaGrupo
      {
        path: 'artistaGrupo',
        component: ArtistaGrupoList,
        data: { seccion: 'Artista Grupo', permiso: 'puedeVer' },
      },
      {
        path: 'artistaGrupo/agregar',
        component: ArtistaGrupoForm,
        data: { seccion: 'Artista Grupo', permiso: 'puedeCrear' },
      },
      {
        path: 'artistaGrupo/actualizar/:id',
        component: ArtistaGrupoForm,
        data: { seccion: 'Artista Grupo', permiso: 'puedeEditar' },
      },
      //#endregion ArtistaGrupo

      //#region CancionAlbum
      {
        path: 'cancionesAlbum',
        component: CancionAlbumList,
        data: { seccion: 'Canción Álbum', permiso: 'puedeVer' },
      },
      {
        path: 'cancionesAlbum/agregar',
        component: CancionAlbumForm,
        data: { seccion: 'Canción Álbum', permiso: 'puedeCrear' },
      },
      {
        path: 'cancionesAlbum/actualizar/:id',
        component: CancionAlbumForm,
        data: { seccion: 'Canción Álbum', permiso: 'puedeEditar' },
      },
      //#endregion CancionAlbum

      //#region InstrumentoArtista
      {
        path: 'instrumentoArtista',
        component: InstrumentoArtistaList,
        data: { seccion: 'Instrumento Artista Grupo', permiso: 'puedeVer' },
      },
      {
        path: 'instrumentoArtista/agregar',
        component: InstrumentoArtistaForm,
        data: { seccion: 'Instrumento Artista Grupo', permiso: 'puedeCrear' },
      },
      {
        path: 'instrumentoArtista/actualizar/:id',
        component: InstrumentoArtistaForm,
        data: { seccion: 'Instrumento Artista Grupo', permiso: 'puedeEditar' },
      },
      //#endregion InstrumentoArtista

      //#region Busqueda
      {
        path: 'buscar/grupo/album/:id',
        component: GrupoAlbum,
        data: {
          permisos: [
            { seccion: 'Grupo', permiso: 'puedeVer' },
            { seccion: 'Álbum', permiso: 'puedeVer' },
          ],
        },
      },
      {
        path: 'buscar/grupo/cancion/:id',
        component: GrupoCancion,
        data: {
          permisos: [
            { seccion: 'Grupo', permiso: 'puedeVer' },
            { seccion: 'Canción', permiso: 'puedeVer' },
          ],
        },
      },
      {
        path: 'buscar/grupo/integrante/:id',
        component: GrupoArtista,
        data: {
          permisos: [
            { seccion: 'Grupo', permiso: 'puedeVer' },
            { seccion: 'Artista Grupo', permiso: 'puedeVer' },
          ],
        },
      },
      {
        path: 'buscar/album/cancion/:id',
        component: AlbumCancion,
        data: {
          permisos: [
            { seccion: 'Álbum', permiso: 'puedeVer' },
            { seccion: 'Canción', permiso: 'puedeVer' },
          ],
        },
      },
      //#endregion Busqueda
    ],
  },
  //#endregion Rutas Protegidas
  { path: 'no-autorizado', component: SinPermiso },

  // { path: '**', redirectTo: '/repertorio/grupo', pathMatch: 'full' },
  { path: '**', component: NotFound, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
