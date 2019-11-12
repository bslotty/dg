import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'form-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  @Input() inputType: string        = "InvalidType";      
  @Input() submitOnEnter: boolean   = false;
  @Input() control: FormControl;

  @Output() submitEvent: EventEmitter<string> = new EventEmitter();

  textType: string = "password";   //  text | password

  constructor() { }

  ngOnInit() { }

  showPassword(show) {
    this.textType = show ? 'text' : 'password';
  }

  sendSubmitEvent() {
    if (this.submitOnEnter) {
      console.log("SubmitEventSent!");
      this.submitEvent.emit("submit");
    }
  }

}
