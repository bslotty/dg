import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Session, SessionBackend } from './backend.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//  Get Data before loading the details page;
export class SessionResolverService implements Resolve<Session> {

  constructor(
    private sessionBackend: SessionBackend
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Session> {
    var id = route.paramMap.get('session');
    var session = new Session();
    session.id = id;

    this.sessionBackend.getDetail(session);
    return this.sessionBackend.detail$;
  }
}
