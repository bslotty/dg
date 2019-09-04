import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { pipe } from 'rxjs';
import { ServerPayload } from 'src/app/app.component';


@Injectable({
  providedIn: 'root'
})
export class AccountBackend implements OnInit {

  user: User;
  redirectUrl: string;

  url: string = environment.apiUrl + '/controllers/players.php';

  passwordPipe = pipe(
    debounceTime(400),
    distinctUntilChanged(),
  )

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  /**
   * @param ServePayload res Subscription Response
   * @returns boolean true if the latest query ran by the server was successfull;
   * -- else false
   */
  rCheck(res): boolean {
    var latest = res["data"].length - 1;
    if (res["data"][latest]["status"] == "success") {
      return true;
    } else {
      return false;
    }
  }

  rGetData(res): Array<any> | boolean {
    var latest = res["data"].length - 1;
    return res["data"][latest]["data"];
  }

  ngOnInit() {
    this.user = new User(null);
  }

  //  Clear User; User in Logout;
  resetUser() {
    this.user = new User(null);
  }

  setUser(user) {
    this.user = new User(user["id"]);
    this.user.first = user["first_name"];
    this.user.last = user["last_name"];
    this.user.email = user["email"];
    this.user.token = user["token"];


  }

  setAuthToken(token) {
    //  Set for future requests
    this.user.token = token;

    //  Store Token as local cache;
    localStorage.setItem("DGC-Token", this.user.token);
  }

  //  Might not need;
  getAuthToken() {
    return this.user.token;
  }


  /*    HTTP  Requests    */
  //  Select
  login(user) {

    return this.http.post(this.url, { "action": "login", "player": user }).pipe(
      map((res) => {

        //  Set user if successfull
        if (this.rCheck(res)) {
          var loggedInPlayer = res['data'][0]["results"][0];
          
          this.setUser(loggedInPlayer);
          this.setAuthToken(loggedInPlayer["token"]);
        }

        //  Return Payload for Feedback
        return res;
      })
    )
  }


  //  Create
  register(user: User) {
    return this.http.post(this.url, { "action": "register", "player": user }).pipe(
      map((res: ServerPayload) => { return res; })
    );
  }

  //  Update
  updateUser(user: User) {
    return this.http.post(this.url, { "action": "update", "player": user });
  }

  updatePassword(user: User) {
    return this.http.post(this.url, { "action": "reset", "player": user }).pipe(
      map((res: ServerPayload) => {
        //  Clear Pass
        this.user.pass = new Password(null);
        return res;
      })
    );
  }

  forgotPassword(user: User) {
    return this.http.post(this.url, { "action": "initate-password-reset", "player": user });
  }

  verify(token: string) {
    return this.http.post(this.url, { "action": "verify", "token": token }).pipe(
      map((res: ServerPayload) => {

        //  Set user if successfull
        if (this.rCheck(res)) {
          var verifiedPlayer = this.rGetData(res);
          this.setUser(verifiedPlayer["player"]);
          this.setAuthToken(verifiedPlayer["player"]["token"])
        }

        //  Return Payload for Feedback
        return res;
      })
    );
  }


  verifyToken(token: string) {
    let url = environment.apiUrl + "/account/token.php";
    return this.http.post(url, { "token": token }).pipe(
      map((res: ServerPayload) => {

        //  Set user if successfull
        if (this.rCheck(res)) {
          console.log("res: ", res);
          this.setUser(res['data']["player"]);
        }

        //  Return Payload for Feedback
        return res;
      })
    );
  }





  logout() {
    this.resetUser();
    this.router.navigate(['account/login']);
  }







}



/**
 *  Classes used within this service 
 */
export class User {

  //  Flag for League Moderation
  public access = {};
  public token;

  constructor(
    public id,
    public first?,
    public last?,
    public email?,
    public pass?,
  ) { }
}

export class Password {
  public old;
  public confirm;

  constructor(
    public current,
  ) { }
}




/**
 *  Player Class for
 */
export class Player {
  created_by;
  created_on;
  modified_by;
  modified_on;
  token;
  token_expires_on;
  last_logon;

  constructor(
    public id,
    public first?,
    public last?,
    public email?,
    public pass?,
  ) { }
}