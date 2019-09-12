import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AccountBackend, Player } from './backend.service';
import { Router } from '@angular/router';
import { ServerPayload } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class AccountFormService {

  private accountForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  accountForm$: Observable<FormGroup> = this.accountForm.asObservable();

  builder: FormBuilder = new FormBuilder;

  private passwordPipe = pipe(
    debounceTime(400),
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
  private cEmail = new FormControl("email", [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128),
    Validators.pattern("(.)+@(.)+")
  ]);


  //  Password
  private cPass = new FormControl("pass", [
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


  //  Old Password
  private cConfirmPass = new FormControl("pass_confirm", [
    Validators.required,
    Validators.minLength(8),
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
  CreateForm(type: string) {

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

      default:
        form.setErrors({ invalid: true });
        break;
    }

    //  Observe Changes for custom errors;
    form.valueChanges.pipe(this.passwordPipe).subscribe((t) => {
      console.log("form.ValueChanges: ", t);
      if (t["old"] == t["pass"]) {
        form.get("pass").setErrors({ same: true });
      } else if (t["old"] == t["conf"]) {
        form.get("conf").setErrors({ same: true });
      } else if (t["pass"] != t["conf"] && (form.get("pass").dirty && form.get("conf").dirty)) {
        form.get("pass").setErrors({ match: true });
        form.get("conf").setErrors({ match: true });
      } else {
        form.setErrors(null);
      }
    });
    this.accountForm.next(form);
  }


  SubmitRegistration() {
    //  If form is valid and password matches
    if (this.accountForm.value.valid && this.accountForm.value.dirty) {

      //  store user
      var user = new Player(0);
      user.first_name   = this.accountForm.value.get('first').value;
      user.last_name    = this.accountForm.value.get('last').value;
      user.email        = this.accountForm.value.get('email').value;
      user.password     = this.accountForm.value.get('pass').value;

      //  send creation request
      this.account.register(user).subscribe((res) => {
        if (res.status == "success") {
          this.router.navigate(["account/login"]);
        }
      });

    }
  }


  SubmitLogin() {

    if (this.accountForm.value.valid && this.accountForm.value.dirty) {
      this.accountForm.value.disable();

      //  Set Data
      var user = new Player(
        null, null, null,
        this.accountForm.value.get('email').value,
        this.accountForm.value.get('password').value
      );

      //  Send Data
      this.account.login(user).subscribe((res) => {
        this.accountForm.value.enable();

        //  Redirect if available; else Goto leagues
        if (this.account.rCheck(res)) {
          if (this.account.redirectUrl) {
            this.router.navigate([this.account.redirectUrl]);
          } else {
            this.router.navigate(['/sessions']);
          }
        } else {

          //  Polish form for re-submit
          this.accountForm.value.markAsPristine();
        }

      });
    }
  }

  SubmitUpdate() {
    
    if (this.accountForm.value.valid && this.accountForm.value.dirty) {  
      var p    = new Player(this.account.user.id);
      p.first_name  = this.accountForm.value.get('first').value;
      p.last_name   = this.accountForm.value.get('last').value;
      p.email       = this.accountForm.value.get('email').value;
      
      this.account.updateUser(p).subscribe((payload: ServerPayload)=>{
        
        if (this.account.rCheck(payload)) {
          this.account.user.first_name  = p.first_name;
          this.account.user.last_name   = p.last_name;
          this.account.user.email       = p.email;
        }
      });
    }
  }

  SubmitReset() {

  }

  SubmitSet() {

  }




}
