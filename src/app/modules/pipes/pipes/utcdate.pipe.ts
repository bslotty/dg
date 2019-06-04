import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UTCDate'
})
export class UTCDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return +(value + "000");
  }

}
