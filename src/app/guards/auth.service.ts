import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    private account: AccountBackend,
    private router: Router,
  ) { }

  /**
   * canActivate(): Check if User Exists
   *  0 -> Store redirect; goto login; return false;
   *  1 -> return true
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): boolean {

    //  If user is set; Allow
    console.log ("guard.account.user: ", this.account.user);
    if (this.account.user && this.account.user.email ) { 
      return true 
    } /* else if (this.account.user && this.account.user.token){
      console.log ("token found:", this.account.user.token);
    } */ else {
      let url: string = state.url;

      //  Store Url for redirect
      this.account.redirectUrl = url;
      //  console.log ("auth.guard.url: ", this.account.redirectUrl);
    
      // Navigate to the login page
      this.router.navigate(['/account/login']);

      //  Deny 
      return false;
    }
  }

  auth() { }
}
