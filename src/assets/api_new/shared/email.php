<?php



class Email
{

	public $headers;
	public $from;
	public $to;
	public $CC;
	public $BCC;
	public $subject;

	public $URL;

	public function __construct()
	{
		//	Set Headers;
		$this->headers    = "MIME-Version: 1.0" . "\r\n";
		$this->headers   .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		//	Set URL For Calls
		//	$this->URL 	= "https://www.disc-golf.center";
		//	$this->URL 	= "https://www.brandonslotty.com/disc";
		$this->URL 		= "http://localhost:4200";
	}

	//	Generic Functions
	public function setFrom($value): void
	{
		//	Store
		$this->from = $value;

		//	Set Headers
		$this->headers   .= "From: <" . $this->from . ">\r\n";
	}

	public function setRecipients($value): void
	{
		$this->to = $value;
	}

	public function setSubject($value): void
	{
		$this->subject = $value;
	}

	public function setBody($html): void
	{
		$this->body = $html;
	}



	public function sendEmail(): bool
	{
		if (mail($this->to, $this->subject, $this->body, $this->headers)) {
			return true;
		} else {
			return false;
		}
	}




	//	Templates
	public function formatVerificationEmail($email, $token): void
	{

		//	From
		$this->setFrom("service@bsdisc.com");

		//	To
		$this->setRecipients($email);

		//	Subject
		$this->setSubject("DGC Account Verification");

		//	Body
		$message    = "<html><body style='color: rgb(80,100,80) !IMPORTANT;'>";
		$message   .= "<h1>BS Disc</h1><h3>Verify Your Account</h3>";
		$message   .= "<p>Click <a href='" . $this->URL . "account/verify/" . $token . "'>Here</a> ";
		$message   .= "to verify your account. <br><br>If you did not initiate this request, ignore this message.</p>";
		$message   .= "</body></html>";

		$this->setBody($message);
	}

	public function formatPasswordResetEmail($email, $token): void
	{
		//	From
		$this->setFrom("service@bsdisc.com");

		//	To
		$this->setRecipients($email);

		//	Subject
		$this->setSubject("DGC Password Reset");

		//	Body
		$message    = "<html stayle='color: rgb(80,100,80) !IMPORTANT;'><body>";
		$message   .= "<h1>BS Disc</h1><h3>Verify Your Account</h3>";
		$message   .= "<p>Click <a href='" . $this->URL . "account/forgot/" . $token . "'>Here</a> ";
		$message   .= "to reset your password. <br><br>If you did not initiate this request, ignore this message.</p>";
		$message   .= "</body></html>";

		$this->setBody($message);
	}
}
