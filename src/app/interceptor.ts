/*

	Placeholder for HTTP INterceptor;
		Will replace & contain the following features:

			HTTP Auth Token 
				Can Incorperate a Timeout with always writing a new token on every request. Timeout can be calculated from modified date.
				
			X Message/Notification(Feedback) Service
				Include Loader boolean in this for resolve replacement

			Retry On Fail


			Possible cache?
*/



import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { AccountBackend } from './modules/account/services/backend.service';
import { FeedbackService } from './modules/feedback/services/feedback.service';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
	  private accountService: AccountBackend,
	  private feedbackService: FeedbackService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	
	console.log ("request: ", request, next);


	console.log (request.params.toString());


	//	Toast Status of Request
	//	;

    request = request.clone({
      setHeaders: {
        Authorization: `dsadsadsadasdqweqweqweqw`
      }
	});
	
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
		if (event instanceof HttpResponse) {
		  console.log ("Event", event);

		  //	Toast Feedback from server if set.
		  if (event.body.msg) {
			this.feedbackService.setMessage({
				status: 	event.body.status, 
				msg: 		event.body.msg, 
				data: []
			});
		  }
		  
		}
		return event; 
	  })
	);
  }
}