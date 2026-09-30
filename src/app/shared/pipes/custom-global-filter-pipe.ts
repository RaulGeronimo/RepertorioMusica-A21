import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customGlobalFilter',
  standalone: false,
})
export class CustomGlobalFilterPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[], searchText: string): T[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      for (const key in item) {
        if (item[key] && item[key].toString().toLowerCase().includes(searchText)) {
          return true;
        }
      }
      return false;
    });
  }
}
