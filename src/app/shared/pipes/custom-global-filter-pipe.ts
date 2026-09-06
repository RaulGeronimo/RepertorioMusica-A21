import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customGlobalFilter',
  standalone: false,
})
export class CustomGlobalFilterPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
