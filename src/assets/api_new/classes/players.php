<?php

class Player
{

	//	Properties
	public $id;
	public $created_by;
	public $created_on;
	public $modified_by;
	public $modified_on;
	public $first_name;
	public $last_name;
	public $email;
	public $token;
	public $token_expires_on;
	public $last_login;

	//	DB
	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}

	//	DB Functions;
	/**
	 * @param Player $item
	 * @param string $type		verify | forgot_password | login(session_id)
	 */
	public function generateToken($item, $type): string
	{
		$str 	= $item["id"] . $item["modified_on"] . 'DGC' . $item["email"] . $item["last_name"] . 'WAAAGH!!' . $type == 'login' ? session_id() : $type;
		$token 	= hash('sha512', $str);

		return $token;
	}

	/**
	 * @param Player $player
	 */
	public function saltPassword($player): string
	{
		//	Original; dn-new dataset;
		//	$str = $payload["user"]["pass"]["current"] . "1337" . strtolower($payload["user"]["email"]);
		//	$hash = hash("sha512", $str);

		return hash("sha512", $player["password"] . '1337' . strtolower($player["email"]));
	}

	/**
	 * @return Date; ISO 8601:  date("U")
	 */
	public function getTokenExpDateExpDate()
	{
		$expiration_date = mktime(date("H") + 3);
		return date("U", $expiration_date);
	}



	//	DB Functions
	//	Create
	public function registerPlayer($item)
	{
		//	Token for Verification
		$token = $this->generateToken($item, "verify");

		//	Format Query
		$query = "INSERT INTO `Players` (
			`id`, `created_by`, `created_on`, `modified_by`, `modified_on`,
			`first_name`, `last_name`, `email`, `token`, `token_expires_on`, `last_login`
		) VALUES (
			:id, :created_by, :created_on, :modified_by, :modified_on,
			:first_name, :last_name, :email, :token, :token_expires_on, :last_login
		);";

		//	Bind Data
		$values = array(
			":id" 				=> $this->db->generateGUID(),
			":created_by" 		=> null,
			":created_on" 		=> date("U"),
			":modified_by" 		=> null,
			":modified_on" 		=> null,
			":first_name" 		=> $item["first_name"],
			":last_name" 		=> $item["last_name"],
			":email" 			=> $item["email"],
			":token" 			=> $token,
			":token_expires_on"	=> $this->getTokenExpDate(),
			":last_login" 		=> null
		);

		//	Insert
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

	/**
	 * @param string $email Email to search for
	 */
	public function getPlayerByEmail($email)
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
		WHERE `email`=:email 
		LIMIT 1";

		$values = array(
			":email" => $email
		);

		return $this->db->Query($query, $values);
	}

	/**
	 * @param string $term
	 * Used to Search for Friends, makes adding people to a session simplified;
	 */
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



	/**
	 * 	Update
	 * 	@param Player $item; 
	 * Object of columns to update. id, modified_by, and modified_on are 
	 * set automatically. Other fields can be missing to not be included 
	 * in the update, or included to be updated.
	 */
	public function updatePlayer($item)
	{

		//	Base Values on each update;
		$values = array(
			":id"           		=> $item["id"],
			":modified_by"    		=> $item["modified_by"],
			":modified_on"       	=> date("U")
		);

		//	Init Query
		$query = "UPDATE `Players` SET";

		//	Update query and values
		foreach ($item as $key => $value) {
			$query .= "`" . $key . "` = :" . $key . ", ";
			$values[":" . $key] = $value;
		};

		//	Remove Trailing ", "
		$query = substr($query, 0, -2);

		//	Finalize Query;
		$query .= " WHERE `id`=:id LIMIT 1";

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




	public function changePassword($player)
	{
		$query = "DELETE
		FROM `Players` 
		WHERE `id`=:id";

		$values = array(
			":id" => $id
		);

		return $this->db->Query($query, $values);
	}


	/**
	 * @param Player $item
	 */
	public function verifyToken($item)
	{
		$query = "SELECT *
		FROM `Players`
		WHERE `token`=:token
		LIMIT 1";

		$values = array(
			":token"	=> $item['token']
		);

		return $this->db->Query($query, $values);
	}
}
