import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';


import { Injectable } from '@angular/core';
import { LeagueBackend } from './../modules/leagues/services/backend.service';
import { AccountBackend } from './../modules/account/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class PermGuard {

  constructor(
    private account: AccountBackend,
    private leagues: LeagueBackend,
    private router: Router,
    
  ) { }


  /*  Get Users Permission level on Navs
    Store as account.user.access[LEAGUE ID] = LEVEL

    If User is >= moderator return true, else false

    */

  canActivate(): boolean {

    /*  Steps
      Verify User exists; -> AuthGuard
      Verify User has access to league; -> LeagueGuard
      Verify User has correct permission levels; -> PermGuard
    

    if (!this.account.user && !this.leagues.league) { 
      this.router.navigate(["/account/login"]); 
      return false 
    } else if (!this.account.user['access']){
      this.router.navigate(["/leagues", this.leagues.league.id, "join"]);
      return false;
    } else if (
      this.account.user['access'][this.leagues.league.id] != "moderator" && 
      this.account.user['access'][this.leagues.league.id] != "creator"){
      return false
    } else {
      return true;
    }
    */

    return true;
  }
}