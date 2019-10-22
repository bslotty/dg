<?php

class Session
{

	//	Properties
	public $id;
	public $created_by;
	public $created_on;
	public $modified_by;
	public $modified_on;
	public $course_id;
	public $starts_on;
	public $title;
	public $format;
	public $par_array;

	//	DB
	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}

	public function getList($start = 0, $limit = 100)
	{
		$query = "SELECT 
			`id`, 
			`created_by`,
			`created_on`,
			`modified_by`,
			`modified_on`,
			`park_name`,
			`city`,
			`state`,
			`zip`,
			`latitude`,
			`longitude` 
		FROM `Courses`
		LIMIT " . (int) $start . ", " . (int) $limit . ";";

		$values = array();

		return $this->db->Query($query, $values);
	}

	/*
	public function search($term, $start = 0, $limit = 100)
	{
		$query = "SELECT 
			`id`, 
			`created_by`,
			`created_on`,
			`modified_by`,
			`modified_on`,
			`park_name`,
			`city`,
			`state`,
			`zip`,
			`latitude`,
			`longitude` 
		FROM `Courses`
		HAVING LOWER( CONCAT(
			`park_name`,';',
			`city`,';',
			`state`,';',
			`zip`
		)) LIKE CONCAT('%%', :term, '%%')
		LIMIT " . (int) $start . ", " . (int) $limit . ";";


		$values = array(
			":term" => strtolower($term)
		);

		return $this->db->Query($query, $values);
	}
	*/

	public function create($session, $user)
	{

		$query = "INSERT INTO `Sessions` 
		(`id`, `created_by`, `created_on`, `modified_by`, `modified_on`, `course_id`, `starts_on`, `title`, `format`, `par_array` ) VALUES 
		(:id, :created_by, :created_on, :modified_by, :modified_on, :course_id, :starts_on, :title, :format, :par_array, :longitude);";

		$values = array(
			':id' 			=> $this->db->generateGUID(),
			':created_by' 	=> $user['id'],
			':created_on' 	=> date('c'),
			':modified_by' 	=> null,
			':modified_on' 	=> null,

			':course_id' 	=> $session['course_id'],
			':starts_on' 	=> $session['starts_on'],
			':state' 		=> $session['state'],
			':title' 		=> $session['title'],
			':format' 		=> $session['format'],
			':par_array' 	=> $session['par_array']
		);

		return $this->db->Query($query, $values);
	}

	public function update($session, $user)
	{
		//	Base Values on each update;
		$values = array(
			":id"				=> $session["id"]
		);

		$course["modified_on"] = date("c");
		$course["modified_by"] = $user["id"];

		//	Init Query
		$query = "UPDATE `Sessions` SET ";

		//	Update query and values
		foreach ($session as $key => $value) {
			if (!array_key_exists(":" . $key, $values)) {
				$query .= "`" . $key . "`=:" . $key . ", ";
				$values[":" . $key] = $value;
			}
		};

		//	Remove Trailing ", "
		$query = substr($query, 0, -2);

		//	Finalize Query;
		$query .= " WHERE `id`=:id LIMIT 1";

		return $this->db->Query($query, $values);
	}



	public function delete($session)
	{ 
		$query = "DELETE FROM `Sessions` WHERE `id`=:id LIMIT 1";

		$values = array(
			':id' => $session["id"] 
		);

		return $this->db->Query($query, $values);
	}

	//	For Delete
	public function getCreator($session, $user)
	{ 
		$query = "SELECT * FROM `Sessions` WHERE `id`=:id AND `created_by`=:userId LIMIT 1";

		$values = array(
			':id' => $session["id"] 
		);

		return $this->db->Query($query, $values);
	}




	/**	UPDATE
	 *  Input course from frontend format to backend format
	 */
	public function ConvertFrontBack($course)
	{
		$newCourse = array(
			'park_name' 	=> $course['parkName'],
			'city' 			=> $course['city'],
			'state' 		=> $course['state'],
			'zip' 			=> $course['zip'],
			'latitude' 		=> $course['lat'],
			'longitude' 	=> $course['lng']
		);

		return $newCourse;
	}



	

	public function UserRecientlyCreated($user)
	{
		$query = "SELECT
			`id`, 
			`created_by`, 
			`created_on`, 
			`modified_by`, 
			`modified_on`, 
			`park_name`, 
			`city`, 
			`state`, 
			`zip`, 
			`latitude`, 
			`longitude`
			FROM `Courses` 
			WHERE `created_by`=:userID 
			ORDER BY `created_on` DESC
			LIMIT 10;";

		$values = array(
			':userID' => $user["id"]
		);

		return $this->db->Query($query, $values);
	}


	public function UserFavorites($user)
	{
		$query = "SELECT
			`c`.`id`, 
			`c`.`created_by`, 
			`c`.`created_on`, 
			`c`.`modified_by`, 
			`c`.`modified_on`, 
			`c`.`park_name`, 
			`c`.`city`, 
			`c`.`state`, 
			`c`.`zip`, 
			`c`.`latitude`, 
			`c`.`longitude`
		FROM `Courses` AS `c`
		JOIN `Favorites` AS `f`
		WHERE 
			`c`.`id`=`f`.`related_id` AND 
			`f`.`related_table`=:related_table AND 
			`f`.`created_by`=:userId
		ORDER BY `c`.`created_on` DESC;";

		$values = array(
			':userId' => $user["id"],
			':related_table' => "courses"

		);

		return $this->db->Query($query, $values);
	}

	public function UserRecientlyPlayed($user)
	{
		$query = "SELECT
			`c`.`id`, 
			`c`.`created_by`, 
			`c`.`created_on`, 
			`c`.`modified_by`, 
			`c`.`modified_on`, 
			`c`.`park_name`, 
			`c`.`city`, 
			`c`.`state`, 
			`c`.`zip`, 
			`c`.`latitude`, 
			`c`.`longitude`
		FROM `Courses` AS `c`
		JOIN `Sessions` AS `sn`
		JOIN `Scores` AS `sc`
		WHERE 
			`c`.`id`=`sn`.`course_id` AND 
			`sn`.`id` = `sc`.`session_id` AND
			`sc`.`player_id` = :userId
		ORDER BY `c`.`created_on` DESC;";

		$values = array(
			':userId' => $user["id"]
		);

		return $this->db->Query($query, $values);
	}
}
