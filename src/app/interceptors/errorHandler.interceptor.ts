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
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

	previousUrl: string = '';

	//  Move to ErrorHandler
	error: boolean = false;
	errorMsg: string = "";
	retryObs: Observable<any>;
	attempts: number = 0;

	constructor(
		private _account: AccountBackend,
		private _feed: FeedbackService,
		private router: Router
	) {
		this.router.events.subscribe((e) => {
			if (e instanceof NavigationStart) {
				console.warn("RESET HTTP");
				this.clearErrors();
			}
		});
	}



	//  Impliment into ErrorInterceptor
	clearErrors() {
		this.error = false;
		this.attempts = 0;
	}

	setErrorMsg(error: string) {
		this.error = true;
		this.attempts++;
		this.errorMsg = error;
	}



	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log("request: ", request, next);

		return next.handle(request).pipe(
			tap(() => {
				this._feed.startLoading(request.body.action);
			}),
			catchError((error, caught) => {

				//	HTTP Errors here
				console.log("catchError: ", error);

				this.setErrorMsg(error.status + ": " + error.statusText);
				this.retryObs = caught;

				if (this.attempts > 3) {

					if (!this.error) {
						this.setErrorMsg("Something is wrong, the server is not responding.");
					}

					this._feed.stopLoading(request.body.action);

					return of([]);
				} else {
					return throwError(error);
				}

			}),
			shareReplay(),
			retryWhen(errors => {
				return errors
					.pipe(
						/*delayWhen(() => timer(3000 + ())),*/
						tap(() => { console.log('retrying ', this.attempts, 'of 3 in ', (this.attempts * 2000), '...') }),
						delay(this.attempts * 2000)
					);
			}),
			map((event: HttpEvent<any>) => {

				if (event instanceof HttpResponse) {

					//	console.log("errorHandler.interceptor.event: ", event);


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

						if (lastEvent.status == "success") {
							//	Good
							//	console.log("server response ok");
							this.clearErrors();

						} else if (lastEvent.status == "error") {
							//	Server response bad;
							//	console.log("server.error:", lastEvent);
							let msg = lastEvent.msg ? lastEvent.msg : "Unknown error";
							this.setErrorMsg(msg);
						}
					} else {

						//	HTTP response bad;
						//	TODO: Seperate 4xx, 5xx, xxx messages, maybe different template 
						//	console.log("http.error:", event);
						let msg = lastEvent.status + ": " + lastEvent.statusText;
						this.setErrorMsg(msg);
					}

					this._feed.stopLoading(request.body.action);
				}

				return event;
			}));
	}
}