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
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//	console.log("request: ", request, next);


		//	Auth Token
		var token = localStorage.getItem("DGC-Token");

		//--!		If Token not set -> Invalid -> Login

		request = request.clone({
			setHeaders: {
				Authorization: token ? token : "",
			}
		});

		//	Loader Init
		this.feedbackService.loading = true;
		this.feedbackService.feedbackMessage = null;

		return next.handle(request).pipe(map((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {

				//	Needs to be replaced with getting the message of the last status; 
				//	Toast Feedback from server if set.
				if (event.body.msg) {

				}

				console.log ("event: ", event);

				//	If last server event's message -> display feedback;
				//		Success	=  	Toast
				//		Error 	=	Message
				var lastEvent = event.body.data[event.body.data.length - 1];
				if (lastEvent.msg && lastEvent.status == "success") {
					this.feedbackService.toast({
						status: lastEvent.status,
						msg: lastEvent.msg,
						data: []
					});
				} else if (lastEvent.msg && lastEvent.status == "error") {
					this.feedbackService.setMessage({
						status: lastEvent.status,
						msg: lastEvent.msg,
						data: []
					});
				}

				//	Return Data?
				if (event.body.status == "success" && event.body.data) {

				}

				// Loader Toggle
				this.feedbackService.loading = false;

			}
			return event;
		})
		);
	}
}