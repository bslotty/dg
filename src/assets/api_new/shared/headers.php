<?php
	//  Session
	session_start();

	//  Headers
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: Origin, Content-Type Authorization');
	header("Access-Control-Allow-Credentials: true");
	header('Access-Control-Max-Age: 1000');
	header('Content-Type: application/json,text/plain');
