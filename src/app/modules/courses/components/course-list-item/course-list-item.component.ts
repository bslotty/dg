import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { flyInPanelRow } from 'src/app/animations';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';
import { Course } from '../../services/backend.service';

@Component({
  selector: 'course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['./course-list-item.component.scss'],
  animations: [flyInPanelRow]
})
export class CourseListItemComponent implements OnInit {
  @Input() course: Course;
  @Input() mode: string; // List(Fav&&Link), Selector(emit), 


  @Output() selected: EventEmitter<Course> = new EventEmitter();

  @Input() selectedCourse:Course;

  constructor(
    private favorites_: FavoritesService,
    private sessionsF: SessionFormService,
  ) { }

  ngOnInit() {  }

  setFavorite(course){
    this.favorites_.addFavorite("course", course);
  }

  removeFavorite(course) {
    this.favorites_.removeFavorite("course", course);
  }

  selectCourse(course){
    this.sessionsF.setCourse(course);
  }

}
