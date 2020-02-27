import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';
import { Course } from '../../services/backend.service';
import { FavoritesService } from 'src/app/shared/modules/favorites/services/favorites.service';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['./course-list-item.component.scss'],
  animations: []
})
export class CourseListItemComponent implements OnInit {
  @Input() course: Course;
  @Input() mode: string[]; // List(Fav&&Link), Selector(emit), 

  @Input() backdrop: boolean = false;


  constructor(
    private favorites_: FavoritesService,
    private sessions_: SessionBackend
  ) { }

  ngOnInit() {  }

  setFavorite(course){
    this.favorites_.addFavorite("course", course);
  }

  removeFavorite(course) {
    this.favorites_.removeFavorite("course", course);
  }

  
  selectCourse(course){
    this.sessions_.setCourse(course);
  }

}
