import { Component } from '@angular/core';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private navigationService: NavigationService) {}
  regresar() {
    this.navigationService.goBack();
  }
}
