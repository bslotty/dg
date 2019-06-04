import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadGuard {

  constructor(
    private router: Router,
    
  ) { }

  /**
   * canActivate(): Check if User Exists
   *  0 -> Store redirect; goto login; return false;
   *  1 -> return true
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {

  }

}
