<?php

class Weight
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


	//	Create
	public function registerPlayer($item)
	{
		$query = "INSERT INTO `Players` (
			`id`, `created_by`, `created_on`, `modified_by`, `modified_on`,
			`first_name`, `last_name`, `email`, `token`, `token_expires_on`, `last_login`
		) VALUES (
			:id, :created_by, :created_on, :modified_by, :modified_on,
			:first_name, :last_name, :email, :token, :token_expires_on, :last_login
		);";

		$values = array(
			":id" 				=> $this->db->generateGUID(),
			":created_by" 		=> null,
			":created_on" 		=> date("r"),
			":modified_by" 		=> null,
			":modified_on" 		=> null,
			":first_name" 		=> $item["first_name"],
			":last_name" 		=> $item["last_name"],
			":email" 			=> $item["email"],
			":token" 			=> $item["token"],
			":token_expires_on"	=> $item["token_expires_on"],
			":last_login" 		=> $item["last_login"]
		);

		return $this->db->Query($query, $values);
	}



	//	Read
	public function getDetails($id)
	{
		$query = "SELECT 
        	`id`,
        	`created_by`,
        	`created_on`,
        	`modified_by`,
        	`modified_on`,
        	`first_name`,
        	`last_name`,
        	`email`,
        	`token`,
        FROM `Players`
        WHERE `id`=:id 
		LIMIT 1";

		$values = array(
			":id" => $id
		);

		return $this->db->Query($query, $values);
	}

	public function searchPlayers($term)
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



	//	Update
	public function updatePlayer($item)
	{
		$query = "UPDATE `Players` SET
            `modified_by` 			= :modified_by,
            `modified_on` 			= :modified_on,
            `first_name` 			= :first_name,
            `last_name` 			= :last_name,
            `email` 				= :email,
            `password` 				= :password,
            `token_expires_on` 		= :token_expires_on
        WHERE `id`=:id 
		LIMIT 1";

		$values = array(
			":id"           		=> $item["id"],
			":modified_by"    		=> $item["modified_by"],
			":modified_on"       	=> date("r"),
			":first_name"       	=> $item["first_name"],
			":last_name"       		=> $item["last_name"],
			":email"       			=> $item["email"],
			":password"       		=> $item["password"],
			":token_expires_on"     => $item["token_expires_on"]
		);

		return $this->db->Query($query, $values);
	}



	//	Delete
	public function removePlayer($id)
	{
		$query = "DELETE
            FROM `Players` 
            WHERE `id`=:id";

		$values = array(
			":id" => $id
		);

		return $this->db->Query($query, $values);
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

	public function changePassword()
	{ }

	public function login()
	{ }

	public function hashPassword()
	{ }
}
