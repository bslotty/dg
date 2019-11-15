import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  //  Migrate all calls from other services to here
  //  This Service should house all common service functions.

  /**
 * @param ServerPayload res Subscription Response
 * @returns boolean true if the latest query ran by the server was successfull;
 * -- else false
 */
  rCheck(res): boolean {
    if (res != null) {
      var latest = res.length - 1;
      if (res[latest]["status"] == "success") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  rGetData(res): Array<any> {
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["results"];
    } else {
      return [];
    }
  }
}
