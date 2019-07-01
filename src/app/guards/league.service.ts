import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';


import { Injectable } from '@angular/core';
import { LeagueBackend } from './../modules/leagues/services/backend.service';
import { AccountBackend } from './../modules/account/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueGuard {

  constructor(
    private account: AccountBackend,
    private leagues: LeagueBackend,
    private router: Router,
  ) { }

  /*  This Guard will verify the user is a member of the league; -> redirect to join if not. */


  canActivate(route: ActivatedRouteSnapshot,) {

    /*  Steps
      Verify User exists; -> AuthGuard
      Verify User has access to league; -> LeagueGuard
      Verify User has correct permission levels; -> PermGuard
    */
    

    console.log ("leagueGuard.league: ", this.leagues);

    if (this.account.user == undefined) {
      return false;
    } else if (!this.account.user.access[route.paramMap.get("league")]){
      this.router.navigate(["/leagues", route.paramMap.get("league"), "join"]);
      return false;
    } else {
      console.log ("this.account.user.access: ", this.account.user.access[route.paramMap.get("league")]);
      return true;
    }
    
    
  }
}
