import { Router, ActivatedRouteSnapshot } from '@angular/router';


import { Injectable } from '@angular/core';
import { LeagueBackend, League } from './../modules/leagues/services/backend.service';
import { AccountBackend } from './../modules/account/services/backend.service';
import { PermissionBackend } from '../modules/permissions/services/backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeagueGuard {

  constructor(
    private account: AccountBackend,
    private leagues: LeagueBackend,
    private permissions: PermissionBackend,
    private router: Router,
  ) { }

  /*  This Guard will verify the user is a member of the league; -> redirect to join if not. */



  canActivate(route: ActivatedRouteSnapshot, ): boolean | Observable<boolean> {

    if (this.account.user == undefined) {
      return false;
    } else {
      var league = new League(route.paramMap.get("league"));
      return this.permissions.memberList(league).pipe(
        map((res) => {
          if (this.account.user.access[league["id"]]) {
            return true;
          } else {
            this.router.navigate(["/leagues", route.paramMap.get("league"), "join"]);
            return false;
          }
        })
      );
    }
  }
}
