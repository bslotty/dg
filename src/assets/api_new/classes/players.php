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
		$result =  $this->db->Query($query, $values);

		//	Send Verification Email;
		if ($result["status"] == "success") {

			//	Setup Email
			$email = new Email();
			$email->formatVerificationEmail($item["email"], $token);

			//	Send Email
			if ($email->sendEmail()) {
				$return = array(
					"status" => "success",
					"msg" => "Account needs to be verified. Please check your email."
				);
			} else {
				$return = array(
					"status" => "error",
					"msg" => "Unable to send verification email."
				);
			}
		} else {
			$return = array(
				"status" => "error",
				"msg" => "Unable to register account."
			);
		}

		return $return;
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
			":modified_on"       	=> date("U"),
			":first_name"       	=> $item["first_name"],
			":last_name"       		=> $item["last_name"],
			":email"       			=> $item["email"],
			":password"       		=> $item["password"],
			":token_expires_on"     => $this->getTokenExpDate()
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




	/*
	Purpose
	Handle any authorization, including any tokens involved in the process;

	Need to Verify Account
		When:
			Account Created

		Why:
			Data Validity Verification

		How:
			Send Email
			Verify Token

		What:
			Player Class needed
				player.token = Stored Value (Generated upon Registration)
				player.token_expires_on = Stored Value (Set upon Registration to now + 3hrs)
				player.last_login = null
		


	Need to Verify Forgot Password Request
		When:
			User Form Submitted

		Why:
			User Requested

		How:
			Send Email
			Verify Token

		What:
			Play Class needed
				player.token = New Gen
				player.token_expires_on = now + 3hrs


	
	Any DB Handle
		When:
			Any HTTP Request is called

		Why: 
			Authorization

		How:
			Return Boolean if token matches localStorage token; (Set upon login)

		What:
			Player Class needed
				player.token = Stored Value (Generated upon login)
				player.token_expires_on = null 

*/



	/**
	 * @param Player $item
	 * @param string $type		verify | forgot_password | login(session_id)
	 */
	public function generateToken($item, $type): string
	{
		$str 	= $item["id"] . $item["created_on"] . 'DGC' . $item["email"] . 'Slots' . $item["last_name"] . 'WAAAGH!!' . $type == 'login' ? session_id() : $type;
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
	 * @param Player $player
	 */
	public function login($player): bool
	{
		//	query
		$query = "SELECT * FROM `Players` WHERE `Email`=:email and `Password`=:hash LIMIT 1";

		//	data
		$values = array(
			":email" => $player["email"]
		);

		$result = $this->db->Query($query, $values);

		if ($result['status'] == "success") {

			$hash = $this->saltPassword($player);

			if ($result["data"]["password"] != $hash) {
				$return = array(
					"status" => "error",
					"msg"   => "Invalid Password"
				);
			} else {
				if ($result["data"]["last_login"] == null) {
					//	Verify
					$token = $this->generateToken($player, "verify");

					//	Setup Email
					$email = new Email();
					$email->formatVerificationEmail($player["email"], $token);

					//	Send Email
					if ($email->sendEmail()) {
						$return = array(
							"status" => "success",
							"msg" => "Account needs to be verified. Please check your email."
						);
					} else {
						$return = array(
							"status" => "error",
							"msg" => "Unable to send verification email."
						);
					}
				} else {

					//	Set Last Login to Now
					$player["last_login"] = date("U");

					//	Update Auth Token
					$player["token"] = $this->generateToken($player, "login");
					$player["token_expires_on"] = null;

					//	Could this fail? Need a check?
					$this->updatePlayer($player);
					return true;
				}
			}
		}

		return false;
	}


	/**
	 * @param Player $item
	 */
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

	/**
	 * @return Date; ISO 8601 date Date("U")
	 */
	public function getTokenExpDateExpDate()
	{
		$expiration_date = mktime(date("H") + 3);
		return date("U", $expiration_date);
	}
}
