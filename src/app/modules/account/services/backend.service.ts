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
export class AccountBackend implements OnInit{

  public user: User;
  public redirectUrl: string;

  public passwordPipe = pipe(
    debounceTime(400),
    distinctUntilChanged(),
  )

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

    ngOnInit() {
      this.user = new User(null);
    }

  //  Clear User; User in Logout;
  resetUser() {
    this.user = new User(null);
  }


    /*    HTTP  Requests    */
    //  Select
    login(user) {
      let url = environment.apiUrl + "/account/login.php";

      //  Grab verificationToken from cache
      user.validationToken = localStorage.getItem("verificationToken");

  
      return this.http.post(url, {"user": user}).pipe(
        map((res)=>{

          //  Set user if successfull
          if (res['status'] == "success") {
            //  Set User
            this.user = new User(res['data']["user"]["id"]);
            this.user.first = res['data']["user"]["first"];
            this.user.last  = res['data']["user"]["last"];
            this.user.email = res['data']["user"]["email"];
            this.user.validationToken = res['data']["user"]["validationToken"];

            //  Store Token as local cache;
            localStorage.setItem("verificationToken", res['data']["user"]["validationToken"]);

          }
          
          //  Return Payload for Feedback
          return res;
        })
      )
    }


    //  Create
    register(user: User) {
      let url = environment.apiUrl + "/account/register.php";
      return this.http.post(url, {"user": user}).pipe(
        map((res: ServerPayload)=>{return res;})
      ); 
    }

    //  Update
    updateUser(user: User) {
      let url = environment.apiUrl + "/account/update.php";
      return this.http.post(url, {"user": user});
    }
  
    updatePassword(user: User) {
      let url = environment.apiUrl + "/account/reset.php";
      return this.http.post(url, {"user": user}).pipe(
        map((res: ServerPayload)=>{
          //  Clear Pass
          this.user.pass = new Password(null, null);
          return res;
        })
      );  
    }

    forgotPassword(user: User) {
      let url = environment.apiUrl + "/account/forgot.php";
      return this.http.post(url, {"user": user});   
    }
    
    verify(token: string) {
      let url = environment.apiUrl + "/account/verify.php";
      return this.http.post(url, {"token": token}).pipe(
        map((res: ServerPayload)=>{

          //  Set user if successfull
          if (res.status == "success") {

            //  Set User
            this.user = new User(res.data["user"]["id"]);
            this.user.first = res.data["user"]["first"];
            this.user.last  = res.data["user"]["last"];
            this.user.email = res.data["user"]["email"];
            this.user.validationToken = res.data["user"]["validationToken"];


          }
          
          //  Return Payload for Feedback
          return res;
        })
      );
    }


    verifyToken(token: string) {
      let url = environment.apiUrl + "/account/token.php";
      return this.http.post(url, {"token": token}).pipe(
        map((res: ServerPayload)=>{

          //  Set user if successfull
          if (res.status == "success") {
            
            //  Set User
            this.user = new User(res.data["user"]["id"]);
            this.user.first = res.data["user"]["first"];
            this.user.last  = res.data["user"]["last"];
            this.user.email = res.data["user"]["email"];
            this.user.validationToken = res.data["user"]["validationToken"];

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
  public validationToken;

  constructor(
    public id,
    public first?,
    public last?,
    public email?,
    public pass?,
  ) {}
}

export class Password {

  constructor (
    public current,
    public confirm?,
  ) {}
}

