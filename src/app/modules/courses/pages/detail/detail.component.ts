import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { CourseBackend, Course } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { loading } from 'src/app/animations';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [loading,]
})
export class DetailComponent implements OnInit {

  public course: Course = new Course(this.route.snapshot.paramMap.get('id'));
  public zoom: number = 14;

  constructor(
    public courses: CourseBackend,
    public route: ActivatedRoute,
    public feed: FeedbackService,
    public location: Location,
  ) { }

  ngOnInit() {
    this.feed.initiateLoading();

    this.getDetail();
    
  }


  getDetail() {
    this.courses.getDetail(this.course).subscribe((v)=>{
      console.log ("course.detail.res:  ", v);

      this.feed.finializeLoading();
    });
  }

  back(){
    this.location.back();
  }

}