import { Injectable } from '@angular/core';
import { Player } from './backend.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountFormService {

  private accountForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  accountForm$: Observable<FormGroup> = this.accountForm.asObservable();

  private builder: FormBuilder;

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

  constructor(player: Player, type: String) {
    /**
     *  Create form from Type:
     *    Basic Info (First, last, email)
     *    Login (email, current)
     *    Reset Pass (old, current, confirm)
    */
  }

  CreateRegisterForm(type: string) {

    var form = this.builder.group({});
    form.addControl("first", this.cFirst);

  }



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
