import { Component, OnInit, Input } from '@angular/core';
import { FavoritesService } from 'src/app/shared/modules/favorites/services/favorites.service';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { Course } from 'src/app/shared/types';

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
    private _favorites: FavoritesService,
    private _sessions: SessionBackend
  ) { }

  ngOnInit() {  }

  setFavorite(course){
    this._favorites.addFavorite("course", course);
  }

  removeFavorite(course) {
    this._favorites.removeFavorite("course", course);
  }

  
  selectCourse(course){
    this._sessions.setCourse(course);
  }

  

}
