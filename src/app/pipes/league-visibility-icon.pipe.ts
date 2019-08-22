import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leagueVisibilityIcon'
})
export class LeagueVisibilityIconPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case "public":
        value = "icon-eye";
        break;
      case "private":
        value = "icon-eye-off";
        break;

      case "solo":
        value = "icon-user";
        break;

      default:
        value = "icon-bug";
        break;
    }

    return value;
  }

}
