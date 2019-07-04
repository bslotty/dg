import { LeagueBackend, League } from './../../leagues/services/backend.service';
import { AccountBackend, User } from './../../account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionBackend {
 
  public accessLevel: string = "";

  public list: Subject<Permission[]> =  new Subject();

  constructor(
    private http: HttpClient,
    private account: AccountBackend,
  ) { }

  setAccessLevel(permissionList: Permission[]){

    permissionList.forEach((permission)=>{

      //  Get Matching User -> Set Access Level
      if (permission.user.id == this.account.user.id) {
        //  Doesnt work
        this.account.user.access[permission.league.id] = permission.level;

        //  Fix
        this.accessLevel = permission.level;
      }
    });
  }

  memberList(league: League) {
    let url = environment.apiUrl + "/permissions/list.php"
    return this.http.post(url, {"league": league, "user": this.account.user}).pipe(
      map((res)=>{

        if (res['status'] == "success") {
        
          this.list.next(res['data']);

          //  Set Access for user upon list gen;
          this.setAccessLevel(res['data']);

          return res['data'];
        } else {

          return []
        }
      })
    );
  }




  getDetail(permission: Permission) {
    let url =  environment.apiUrl + "/permissions/detail.php"
    return this.http.post(url, {"permission": permission}).pipe(
      map((res: ServerPayload)=>{
        if (res.status == "success") {
          var permission = res.data["0"]; 
          return new Permission(
            permission.id,
            new League(permission.league.id),
            new User(permission.user.id, permission.user.first, permission.user.last),
            permission.level,
            permission.status
          );
        } else {
          return [];
        }
      })
    );
  }

  update(league: League, permission: Permission) {
    let url =  environment.apiUrl + "/permissions/update.php";
    return this.http.post(url, {
      "league": league,
      "user": this.account.user,
      "permission": permission
    }).pipe(
      map((res: ServerPayload)=>{return res;})
    );
  }

  deletePermission(league: League, permission: Permission) {
    let url =  environment.apiUrl + "/permissions/delete.php";
    return this.http.post(url, {
      "league": league,
      "user": this.account.user,
      "permission": permission
    }).pipe(
      map((res: ServerPayload)=>{return res;})
    );
  }


  joinRequest(league: League) {
    let url =  environment.apiUrl + "/permissions/create.php"
    return this.http.post(url, {"league": league, "user": this.account.user}).pipe(
      map((res: ServerPayload)=>{return res;})
    );
  }




}


export class Permission {
  constructor(
    public id: string,
    public league?: League,
    public user?: User,
    public level?: string,
    public status?: string,
  ) {}
}
