import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strokeTotal'
})
export class StrokeTotalPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    //  Get Total All Scores
    if (value.length == 0) {
      return "Error";
    } else {
      return value.reduce((sum, current) =>  sum + current);
    }
  }

}
