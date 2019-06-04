import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


/*    Types   */
import { Session } from '../../sessions/services/backend.service';
import { Permission } from '../../permissions/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueBackend implements OnInit {

  league: League;

  constructor(
    private http: HttpClient,
    private account: AccountBackend,
  ) { }

  ngOnInit() { }

  getList() {
    let url = environment.apiUrl + "/leagues/list.php"
    return this.http.post(url, { "league": "all", "user": this.account.user }).pipe(
      map((res) => {

        if (res['status'] == "success") {
          var result = [];

          res['data']["leagues"].forEach((league) => {
            result.push(new League(
              league.id,
              league.name,
              league.visibility,
              league.description,
              league.restrictions,
            ))
          });
          return result;
        } else {
          return [];
        }
      }))
  }

  getDetail(league: League) {
    let url = environment.apiUrl + "/leagues/detail.php";
    return this.http.post(url, { "league": league, "user": this.account.user })
      .pipe(
        map((res) => {
          if (res['status'] == "success") {
            this.league = new League(
              res["data"]["id"],
              res["data"]["name"],
              res["data"]["visibility"],
              res["data"]["description"],
              res["data"]["restrictions"],
            );
            return this.league;
          } else {
            return [];
          }
        })
      );
  }


  search(term: string) {
    let url = environment.apiUrl + "/leagues/search.php";
    return this.http.post(url, { "term": term }).pipe(
      map((res: ServerPayload) => {
        if (res.status == "success") {
          var result: League[] = [];

          res.data["leagues"].forEach((league) => {
            result.push(new League(
              league.id,
              league.name,
              league.visibility,
              league.description,
              league.restrictions,
            ))
          });
          return result;
        } else {
          return [];
        }
      })
    );
  }



  create(league: League) {
    let url = environment.apiUrl + "/leagues/create.php";
    return this.http.post(url, { "league": league, "user": this.account.user }).pipe(
      map((res: ServerPayload) => {
        return res;
      })
    )
  }



  update(league: League) {
    let url = environment.apiUrl + "/leagues/update.php";
    return this.http.post(url, { "league": league, "user": this.account.user }).pipe(
      map((res: ServerPayload) => {
        return res;
      })
    );
  }

  delete(league: League) {
    let url = environment.apiUrl + "/leagues/delete.php";
    return this.http.post(url, { "league": league, "user": this.account.user }).pipe(
      map((res: ServerPayload) => {
        return res;
      })
    );
  }
}


export class League {
  public userLevel: string;

  constructor(
    public id: string,
    public name?: string,
    public visibility?: string,
    public description?: string,
    public restrictions?: string,
    public sessions?: Session[],
    public permissions?: Permission[],
  ) { }
} 