import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

  transform(items: Product[], filterQueries: any): Product[] {
    if (!items) return [];
    if (filterQueries.length === 0) return items;
    
    const filters = [];
    for (const filter of filterQueries) {
      filters.push(filter.value.toLowerCase());
    }
    return items.filter(item => {
      return filters.includes(item.category.toLowerCase());
    });
  }
}
