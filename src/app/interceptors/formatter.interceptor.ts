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

import { Observable, of } from 'rxjs';

import { AccountBackend } from '../modules/account/services/backend.service';
import { FeedbackService } from '../shared/modules/feedback/services/feedback.service';
import { map, catchError } from 'rxjs/operators';
import { HelperService } from '../shared/services/helper.service';
import { Course } from '../shared/types';

@Injectable()
export class FormatterInterceptor implements HttpInterceptor {

	previousUrl: string = '';

	constructor(
		private _account: AccountBackend,
		private _feed: FeedbackService,
		private _helper: HelperService
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//	console.log("request: ", request, next);

		return next.handle(request).pipe(

			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {

					let list = event.body;
					let latest = list.length - 1;

					switch (list[latest].mapTo) {
						case "course":
							list[latest].formattedResults = this._helper.convertCourse(list[latest].results);
							break;
 
						case "session":
							list[latest].formattedResults = this._helper.convertSession(list[latest].results);
							break;

						case "scores":
							list[latest].formattedResults = this._helper.convertScores(list[latest].results);
							break;
					}

					//	console.log("formattedServerResponse: ", event);
					return event;

				}
				return event;
			}));


	}
}