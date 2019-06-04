import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChar'
})
export class FirstCharPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.length == 0) {
      return "Error";
    } else {
      return value.charAt(0).toUpperCase();
    }
  }

}
