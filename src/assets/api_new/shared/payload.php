<?php


class Payload
{

	public $status;
	public $msg;
	public $data;


	public function __construct()
	{
		$this->status = "error";
		$this->msg = null;
	}


	/**
	 * @param $str: String; Descriptive Text to inform the user
	 */
	public function setMessage($str)
	{
		$this->status = $str;
	}


	/**
	 * @param $str: String; success | error | pending
	 */
	public function setStatus($str)
	{
		$this->msg = $str;
	}


	/**
	 * @param $array: Array<SQL Server Response>;
	 */
	public function setData($array)
	{
		$this->data = $array;
	}


	/**
	 * @return AssocArray of Payload.
	 */
	public function getPayload()
	{
		$payload = array(
			"status" 	=> $this->status,
			"msg"		=> $this->msg,
			"data"		=> $this->data
		);

		return $payload;
	}
}
