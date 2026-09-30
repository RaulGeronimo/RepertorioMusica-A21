import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImages]',
  standalone: false,
})
export class Images {
  @Input() appImagenFallback: string = '/images/imagen-rota.png';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    this.el.nativeElement.src = this.appImagenFallback;
  }
}
