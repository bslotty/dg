import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AccountBackend, Player, Password } from './backend.service';
import { Router } from '@angular/router';
import { ServerPayload } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class AccountFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

  builder: FormBuilder = new FormBuilder;

  private passwordPipe = pipe(
    debounceTime(888),
    distinctUntilChanged(),
  );

  private searchPipe = pipe(
    debounceTime(300),
    distinctUntilChanged(),
  )

  //  Fields
  //  First
  private cFirst = new FormControl("first", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  //  Last  
  private cLast = new FormControl("last", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  //  Email
  private cEmail = new FormControl("b", [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128),
    Validators.pattern("(.)+@(.)+")
  ]);


  //  Password
  private cPass = new FormControl("", [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128)
  ]);


  //  Old Password
  private cOldPass = new FormControl("pass_old", [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128)
  ]);


  //  Confirm Password
  private cConfirmPass = new FormControl("pass_confirm", [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128)
  ]);

  //  Search
  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  constructor(
    private router: Router,
    private account: AccountBackend,
  ) {
    /**
     *  Create form from Type:
     *    Basic Info (First, last, email)
     *    Login (email, current)
     *    Reset Pass (old, current, confirm)
    */
    /**
    *  https://medium.com/@joshblf/dynamic-nested-reactive-forms-in-angular-654c1d4a769a
    * 
    *  All form actions should be migrated to here.
    *  Setup form as a Private Behavior Subject
    * 
    *    Fields should be determined by functions; dynamic add + validatiors
    * 
    *  Each component can view the form as an observable.
    * 
    * 
    *  Submits will be handeled here;
    *  
    * 
    */
  }



  /**
   * @param type; register | login | update | reset | set |
   * 
   */
  Setup(type: string) {

    //  Create Form
    var form = this.builder.group({});

    //  Add Fields
    switch (type) {
      case "register":
        form.addControl("first", this.cFirst);
        form.addControl("last", this.cLast);
        form.addControl("email", this.cEmail);
        form.addControl("password", this.cPass);
        form.addControl("conf", this.cConfirmPass);
        break;

      case "login":
        form.addControl("email", this.cEmail);
        form.addControl("password", this.cPass);
        break;

      case "update":
        form.addControl("first", this.cFirst);
        form.addControl("last", this.cLast);
        form.addControl("email", this.cEmail);
        break;

      case "reset":
        form.addControl("old", this.cOldPass);
        form.addControl("password", this.cPass);
        form.addControl("conf", this.cConfirmPass);
        break;

      case "set":
        form.addControl("password", this.cPass);
        form.addControl("conf", this.cConfirmPass);
        break;

      case "forgot":
        form.addControl("email", this.cEmail);
        break;

      case "search":
        form.addControl("term", this.cTerm);
        form.valueChanges.pipe(this.searchPipe).subscribe((v)=>{
          this.account.searchUsers(v["term"]).subscribe((p)=>{
            console.log ("P:", p);
          });
        });

      default:
        form.setErrors({ invalid: true });
        break;
    }

    //  Observe Changes for custom errors;
    form.valueChanges.pipe(this.passwordPipe).subscribe((t) => {
      //  console.log("form.ValueChanges: ", form, t);


      //  Reset Fields upon Update
      if (t["old"]) {
        form.get('old').setErrors(null);
      }

      if (t["conf"]) {
        form.get('conf').setErrors(null);
      }

      if (t["password"]) {
        form.get('password').setErrors(null);
      }
      

      if (t["old"] && t["old"] == t["password"]) {
        form.get("password").setErrors({ same: true });

      } else if (t["old"] && t["conf"] && t["old"] == t["conf"]) {
        form.get("conf").setErrors({ same: true });

      } else if (t["conf"] && t["password"] != t["conf"] && (form.get("password").dirty && form.get("conf").dirty)) {
        form.get("password").setErrors({ match: true });
        form.get("conf").setErrors({ match: true });

      } else {
        form.setErrors(null);
      }
    });

    //  Push Form
    this.form.next(form);
  }

  /**
   *  @returns boolean
   *  Form needs to be Valid, Touched, and not Disabled.
   */
  ReadyForSubmission(): boolean {
    if (this.form.value.valid && this.form.value.dirty && !this.form.value.disabled) {
      return true;
    } else {
      return false;
    }
  }


  SubmitRegistration() {
    //  If form is valid and password matches
    if (this.ReadyForSubmission()) {

      //  store user
      var user = new Player(0);
      user.first_name = this.form.value.get('first').value;
      user.last_name = this.form.value.get('last').value;
      user.email = this.form.value.get('email').value;
      user.password = this.form.value.get('password').value;

      //  send creation request
      this.account.register(user).subscribe((res) => {
        if (res.status == "success") {
          this.router.navigate(["account/login"]);
        }
      });

    }
  }


  SubmitLogin() {

    if (this.ReadyForSubmission()) {
      this.form.value.disable();

      //  Set Data
      var user = new Player(
        null, null, null,
        this.form.value.get('email').value,
        this.form.value.get('password').value
      );

      //  Send Data
      this.account.login(user).subscribe((res) => {
        this.form.value.enable();

        //  Redirect if available; else Goto leagues
        if (this.account.rCheck(res)) {
          if (this.account.redirectUrl) {
            this.router.navigate([this.account.redirectUrl]);
          } else {
            this.router.navigate(['/sessions']);
          }
        } else {

          //  Polish form for re-submit
          this.form.value.markAsPristine();
        }

      });
    }
  }

  SubmitUpdate() {

    if (this.ReadyForSubmission()) {
      var p = new Player(this.account.user.id);
      p.first_name = this.form.value.get('first').value;
      p.last_name = this.form.value.get('last').value;
      p.email = this.form.value.get('email').value;

      this.account.updateUser(p).subscribe((payload: ServerPayload) => {

        if (this.account.rCheck(payload)) {
          this.account.user.first_name = p.first_name;
          this.account.user.last_name = p.last_name;
          this.account.user.email = p.email;
        }
      });
    }
  }

  SubmitForgot() {
    if (this.ReadyForSubmission()) {

      var user = new Player(null);
      user.email = this.form.value.get('email').value;

      this.account.forgotPassword(user).subscribe((res) => {
        //  Confirmation Page?
        //  Home Page?
      });
    }
  }

  SubmitReset() {
    if (this.ReadyForSubmission()) {

      var newPass = new Password();
      newPass.current = this.form.value.get('password').value;
      newPass.confirm = this.form.value.get('conf').value;
      newPass.old = this.form.value.get('old').value;

      this.account.user.password = newPass;
      this.account.updatePassword(this.account.user).subscribe((res) => {
        this.account.user.password = null;
      });
    }
  }

  VerifyForgotToken(token) {
    this.account.verifyToken(token).subscribe((res: ServerPayload) => {
      console.log("res", res);

      if (this.account.rCheck(res)) {
        this.Setup("set");
      } else {
        this.router.navigate(["account/forgot"]);
      }
    });
  }



  SubmitSet() {
    if (this.ReadyForSubmission()) {

      var newPass = new Password();
      newPass.current = this.form.value.get('password').value;
      newPass.confirm = this.form.value.get('conf').value;

      this.account.user.password = newPass;
      this.account.setPassword(this.account.user).subscribe((res) => {
        this.account.user.password = null;
        if (this.account.rCheck(res)) {
          this.router.navigate(["account"]);
        } else { }
      });
    }
  }

}
