import { Injectable } from '@angular/core';
import { Player } from './backend.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountFormService {

  private accountForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  accountForm$: Observable<FormGroup> = this.accountForm.asObservable();

  private builder: FormBuilder;

  constructor(player: Player, type: String) {
    /**
     *  Create form from Type:
     *    Basic Info (First, last, email)
     *    Login (email, current)
     *    Reset Pass (old, current, confirm)
     */

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
