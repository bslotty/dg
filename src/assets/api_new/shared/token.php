<?php

class Token
{

	public $id;
	public $timestamp;
	public $weight;


	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}



	//	Utility
	public function generateToken($item)
	{
		$str 	= $item["id"] . $item["created_on"] . 'DGC' . $item["email"] . 'Slots' . $item["last_name"];
		$token 	= hash('sha512', $str);

		return $token;
	}

	public function verifyToken($item)
	{
		$query = "SELECT
			`id`,
			`first_name`,
			`last_name`,
			`email`,
		FROM `Players`
		WHERE POSITION(:term IN CONCAT(
			`first_name`,
			`last_name`,
			`email`,
		)) > 0
		ORDER BY `modified_on` DESC 
		LIMIT 10";

		$values = array(
			":term"	=> $term
		);

		return $this->db->Query($query, $values);
	}

	public function setToken()
	{ }

}