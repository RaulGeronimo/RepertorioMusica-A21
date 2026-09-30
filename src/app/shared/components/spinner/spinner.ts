import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: false,
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  loading = inject(LoadingService);
}
