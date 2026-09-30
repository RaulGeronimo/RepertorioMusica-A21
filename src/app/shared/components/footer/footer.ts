import { Component } from '@angular/core';
import { NavExternalLinkItem } from '@core/models/nav-item';
import { Navigation } from '@core/models/navigation';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  otrosProyectos: NavExternalLinkItem[] = [
    {
      id: 1,
      nombre: 'Repertorio Música',
      url: environment.urlMusica,
    },
    {
      id: 2,
      nombre: 'Repertorio Series',
      url: environment.urlSeries,
    },
    {
      id: 3,
      nombre: 'Repertorio Anime',
      url: environment.urlAnime,
    },
  ];

  proyecto: NavExternalLinkItem = this.otrosProyectos.find(
    (proyecto) => proyecto.id === environment.proyecto,
  )!;

  navigation: Navigation[] = [
    {
      id: 1,
      titulo: 'Facebook',
      icono: 'fa-brands fa-facebook-f',
      ruta: 'https://www.facebook.com/raulgabriel.geronimoherrera/',
    },
    {
      id: 2,
      titulo: 'WhatsApp',
      icono: 'fa-brands fa-whatsapp',
      ruta: 'https://api.whatsapp.com/send?phone=5528973869',
    },
    {
      id: 3,
      titulo: 'Outlook',
      icono: 'fa-regular fa-envelope',
      ruta: 'mailto:geronimoraul400@gmail.com',
    },
    {
      id: 4,
      titulo: 'Instagram',
      icono: 'fa-brands fa-instagram',
      ruta: 'https://www.instagram.com/raul_geronimoherrera/',
    },
    {
      id: 5,
      titulo: 'Linkedin',
      icono: 'fa-brands fa-linkedin',
      ruta: 'https://www.linkedin.com/in/ra%C3%BAl-gabriel-ger%C3%B3nimo-herrera-293665293/',
    },
  ];
}
