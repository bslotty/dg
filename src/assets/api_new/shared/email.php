<?php



class Email
{

	public $headers;
	public $from;
	public $to;
	public $CC;
	public $BCC;
	public $subject;

	public function __construct()
	{
		//	Set Headers;
		$this->$headers    = "MIME-Version: 1.0" . "\r\n";
		$this->$headers   .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		//	Set From
		$this->$headers   .= 'From: '. $this->$from . "\r\n";	
	}

	public function setHeaders($value) {
		$this->$headers = $value;
	}

	public function setRecipients($value){
		$this->$to = $value;
	}

	public function setSubject($value){
		$this->$subject = $value;
	}

	public function setBody($html) {
		$this->$body = $html;
	}


	public function sendEmail() {
		$return;

		if (mail($to, $subject, $body, $headers)) {
			$return = array(
				"status" => "success",
				"msg" => "Email Sent!"
			);
		} else {
			$return = array(
				"status" => "error",
				"msg" => "Unable to send email. Please try again."
			);
		}

		return $return;
	}



}