import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionBackend } from '../modules/sessions/services/backend.service';
import { AccountBackend } from '../modules/account/services/backend.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionAdminGuard implements CanActivate {

  constructor(
    private sessionBackend: SessionBackend,
    private accountBackend: AccountBackend
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) /*: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree */ {

    console.log("sessionAdmin#canActivate");
    return true;

    /*
      var obs = this.sessionBackend.detail$.pipe(take(1), map((s) => {
        console.log("session.detail$:", s);
        if (s.created_by == this.accountBackend.user.id) {
          console.log("SessionAdminGuard.passed: ", this.accountBackend.user.id, s);
          return true;
        } else {
          console.log("SessionAdminGuard.failed: ", this.accountBackend.user.id);
          return false;
        }
      })).subscribe();
    */

  }

}
