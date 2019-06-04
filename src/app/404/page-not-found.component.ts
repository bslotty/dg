import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


/*  Other Codes to Manage:    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

  418 I'm a teapot
    The server refuses the attempt to brew coffee with a teapot.


  429 Too Many Requests
    The user has sent too many requests in a given amount of time ("rate limiting").


  500 Internal Server Error
    The server has encountered a situation it doesn't know how to handle.

  502 Bad Gateway
    This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.

  503 Service Unavailable
    The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.

  504 Gateway Timeout
    This error response is given when the server is acting as a gateway and cannot get a response in time.
*/
