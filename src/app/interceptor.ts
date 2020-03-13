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
import { FeedbackService } from './shared/modules/feedback/services/feedback.service';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

	previousUrl: string = '';

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

		return next.handle(request).pipe(map((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {

				//	Needs to be replaced with getting the message of the last status; 
				//	Toast Feedback from server if set.
				//	if (event.body.msg) { }

				console.log("interceptor.event: ", event);

				//	If last server event's message -> display feedback;
				//		Success	=  	Toast
				//		Error 	=	Message
				if (/* event.body != null */ event.status != 200) {
					var lastEvent = event.body[event.body.length - 1];
					if (lastEvent.msg && lastEvent.status == "success") {


						//	Map Types here

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
				} else {
					this.feedbackService.setMessage({
						status: "error",
						msg: event.status + ": " + event.statusText,
						data: []
					});
				}


				// Loader Toggle
				//	this.feedbackService.loading = false;

			}
			return event;
		})
		);
	}
}