import { Location } from '@angular/common';
import { distinctUntilChanged, timeout, debounceTime, delay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueBackend, League } from '../../services/backend.service';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [flyInPanelRow],
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results: League[];
  resolve: boolean = false;

  message: string;

  status: string = "fresh";

  constructor(
    public builder: FormBuilder,
    public leagues: LeagueBackend,
    public location: Location
  ) { }

  ngOnInit() {
    this.initForm();

    this.resolve = true;

    console.log("results: ", this.results);


    //  Listen to Search Changes
    this.form.get('term').valueChanges.pipe(

    ).subscribe((term) => {
      
      this.search(term);
    });
  }

  search(term) {

    this.resolve = false;
    console.log("form.term: ", this.form.get("term"));


    //  Only If Valid and Dirty
    if (this.form.get('term').valid && this.form.get('term').dirty) {

      //  Get Results
      this.leagues.search(term).pipe(
        delay(500),
        distinctUntilChanged(),
        timeout(1000),
      ).subscribe((res) => {
        console.log(res);


        this.resolve = true;

        if (res.length == 0) {
          this.status = "empty";
        } else {
          this.status = "success";
          this.results = res;
        }


      }, (e) => {

        this.resolve = true;
        this.status = "error";
        if (e.name = 'TimeoutError') {
          this.message = "Request Timed Out.";
        } else {
          this.message = "An Error Occurred.";
        }

      });
    } else if (this.form.get('term').value == "") {
      this.resolve = true;
      this.status = 'fresh';
      this.message = "";
    } else {
      this.resolve = true;
      this.status = "error";
      this.message = "Invalid Search Term.";
    }
  }


  initForm() {
    this.form = this.builder.group({
      term: ["", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(128),
      ]],
    })
  }


  back() {
    this.location.back();
  }

}
