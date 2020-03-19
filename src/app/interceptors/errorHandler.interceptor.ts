import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';

import { Observable, of, throwError, timer } from 'rxjs';

import { AccountBackend } from '../modules/account/services/backend.service';
import { FeedbackService } from '../shared/modules/feedback/services/feedback.service';
import { map, catchError, throttleTime, shareReplay, retryWhen, delayWhen, tap, delay } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

	previousUrl: string = '';

	constructor(
		private _account: AccountBackend,
		private _feed: FeedbackService,
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//	console.log("request: ", request, next);

		return next.handle(request).pipe(
			tap(()=>{this._feed.loading = true}),
			catchError((error, caught) => {

				//	HTTP Errors here

				console.log("catchError: ", error);

				this._feed.setErrorMsg(error.status + ": " + error.statusText);
				this._feed.retryObs = caught;

				if (this._feed.attempts > 3) {

					if (!this._feed.error) {
						this._feed.setErrorMsg("Something is wrong, the server is not responding.");
					}
					
					this._feed.loading = false;

					console.warn("!!!! ERROR !!!!");

					return of([]);
				} else {
					return throwError(error).pipe(
						
					);
				}
				
			}),
			shareReplay(),
			retryWhen(errors => {
				return errors
					.pipe(
						/*delayWhen(() => timer(3000 + ())),*/
						tap(() => { console.log('retrying ', this._feed.attempts, 'of 3 in ', (this._feed.attempts * 2000) ,'...') }),	
						delay(this._feed.attempts * 2000)			
					);
			}),
			map((event: HttpEvent<any>) => {

				if (event instanceof HttpResponse) {

					console.log("errorHandler.interceptor.event: ", event);


					//	Needs to be replaced with getting the message of the last status; 
					//	Toast Feedback from server if set.
					//	if (event.body.msg) { }
					//
					//	If last server event's message -> display feedback;
					//		Success	=  	Toast
					//		Error 	=	Message
					if (/* event.body != null */ event.status == 200) {

						//	Get latest server event;
						var lastEvent = event.body[event.body.length - 1];

						if (lastEvent.msg && lastEvent.status == "success") {
							console.log("server response ok");
							this._feed.clearErrors();

						} else if (lastEvent.msg && lastEvent.status == "error") {
							//	Server response bad;
							console.log("server.error:", lastEvent);

							//	Set error message
							this._feed.setErrorMsg(lastEvent.msg);

							this._feed.loading = false;
						}
					} else {

						//	HTTP Response not good;
						//	TODO: Seperate 4xx, 5xx, xxx messages 
						console.log("http.error:", event);
						this._feed.setErrorMsg(lastEvent.status + ": " + lastEvent.statusText);
					}
				}

				return event;
			}));
	}
}