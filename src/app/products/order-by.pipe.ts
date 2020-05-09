import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product.model';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(items: Product[], orderQuery: string): Product[] {
    if (!items) return [];
    if (orderQuery !== "title" && orderQuery !== "price") return items;
    console.log(orderQuery);
    const item = items[0];

    if (orderQuery === "price") {
      return items.sort((a, b) => a.price - b.price);
    }
    
    if (orderQuery === "title") {
      return items.sort((a, b) => {
        return a[orderQuery].toLowerCase().charAt(0).localeCompare(b[orderQuery].toLowerCase().charAt(0));
      });
    }
  }
}
