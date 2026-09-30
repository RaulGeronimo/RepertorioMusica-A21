import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-export-button',
  standalone: false,
  templateUrl: './export-button.html',
  styleUrl: './export-button.css',
})
export class ExportButton {
  exportar: boolean = environment.exportar;

  @Input() color: string = 'success';
  @Input() outline: boolean = true;
  @Input() size: number = 16;
  @Input() action!: () => void;
  @Input() extraClass: string = '';

  get btnClass(): string {
    return `btn btn-${this.color} ${this.extraClass}`.trim();
  }
}
