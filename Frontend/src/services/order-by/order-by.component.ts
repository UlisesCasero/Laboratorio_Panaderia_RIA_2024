import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByComponent implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array) || array.length <= 1) {
      return array;
    }

    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });

    return array;
  }
}
