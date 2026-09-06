import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { Dashboard } from './features/repertorio/dashboard/dashboard';
import { BitacoraCarga } from './features/repertorio/bitacora/bitacora-carga/bitacora-carga';
import { BitacoraError } from './features/repertorio/bitacora/bitacora-error/bitacora-error';
import { Perfil } from './features/repertorio/usuarios/perfil/perfil';
import { UsuarioList } from './features/repertorio/usuarios/usuario-list/usuario-list';
import { ExportButton } from './shared/components/export-button/export-button';
import { Footer } from './shared/components/footer/footer';
import { SinPermiso } from './shared/components/sin-permiso/sin-permiso';
import { Navigation } from './shared/components/navigation/navigation';
import { NotFound } from './shared/components/not-found/not-found';
import { CustomGlobalFilterPipe } from './shared/pipes/custom-global-filter-pipe';
import { Images } from './shared/directives/images';
import { Spinner } from './shared/components/spinner/spinner';
import { AlbumForm } from './features/repertorio/album/album-form/album-form';
import { AlbumList } from './features/repertorio/album/album-list/album-list';
import { ArtistaForm } from './features/repertorio/artista/artista-form/artista-form';
import { ArtistaList } from './features/repertorio/artista/artista-list/artista-list';
import { ArtistaGrupoForm } from './features/repertorio/artista-grupo/artista-grupo-form/artista-grupo-form';
import { ArtistaGrupoList } from './features/repertorio/artista-grupo/artista-grupo-list/artista-grupo-list';
import { CancionForm } from './features/repertorio/cancion/cancion-form/cancion-form';
import { CancionList } from './features/repertorio/cancion/cancion-list/cancion-list';
import { CancionAlbumForm } from './features/repertorio/cancion-album/cancion-album-form/cancion-album-form';
import { CancionAlbumList } from './features/repertorio/cancion-album/cancion-album-list/cancion-album-list';
import { DisqueraForm } from './features/repertorio/disquera/disquera-form/disquera-form';
import { DisqueraList } from './features/repertorio/disquera/disquera-list/disquera-list';
import { GrupoForm } from './features/repertorio/grupo/grupo-form/grupo-form';
import { GrupoList } from './features/repertorio/grupo/grupo-list/grupo-list';
import { InstrumentoForm } from './features/repertorio/instrumento/instrumento-form/instrumento-form';
import { InstrumentoList } from './features/repertorio/instrumento/instrumento-list/instrumento-list';
import { InstrumentoArtistaForm } from './features/repertorio/instrumento-artista/instrumento-artista-form/instrumento-artista-form';
import { InstrumentoArtistaList } from './features/repertorio/instrumento-artista/instrumento-artista-list/instrumento-artista-list';
import { PaisForm } from './features/repertorio/pais/pais-form/pais-form';
import { PaisList } from './features/repertorio/pais/pais-list/pais-list';
import { GrupoAlbum } from './features/repertorio/busqueda/grupo-album/grupo-album';
import { GrupoArtista } from './features/repertorio/busqueda/grupo-artista/grupo-artista';
import { GrupoCancion } from './features/repertorio/busqueda/grupo-cancion/grupo-cancion';
import { AlbumCancion } from './features/repertorio/busqueda/album-cancion/album-cancion';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    ResetPassword,
    Dashboard,
    BitacoraCarga,
    BitacoraError,
    Perfil,
    UsuarioList,
    ExportButton,
    Footer,
    SinPermiso,
    Navigation,
    NotFound,
    CustomGlobalFilterPipe,
    Images,
    Spinner,
    AlbumForm,
    AlbumList,
    ArtistaForm,
    ArtistaList,
    ArtistaGrupoForm,
    ArtistaGrupoList,
    CancionForm,
    CancionList,
    CancionAlbumForm,
    CancionAlbumList,
    DisqueraForm,
    DisqueraList,
    GrupoForm,
    GrupoList,
    InstrumentoForm,
    InstrumentoList,
    InstrumentoArtistaForm,
    InstrumentoArtistaList,
    PaisForm,
    PaisList,
    GrupoAlbum,
    GrupoArtista,
    GrupoCancion,
    AlbumCancion,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideCharts(withDefaultRegisterables())],
  bootstrap: [App],
})
export class AppModule {}
