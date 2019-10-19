<?php

class Course
{

	//	Properties
	public $id;
	public $created_by;
	public $created_on;
	public $modified_by;
	public $modified_on;
	public $name;
	public $park_name;
	public $city;
	public $state;
	public $zip;
	public $latitude;
	public $longitude;

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

	public function create($course, $user)
	{
		$query = "INSERT INTO `Courses` 
		(`id`, `created_by`, `created_on`, `modified_by`, `modified_on`, `park_name`, `city`, `state`, `zip`, `latitude`, `longitude` ) VALUES 
		(:id, :created_by, :created_on, :modified_by, :modified_on, :park_name, :city, :state, :zip, :latitude, :longitude);";

		$values = array(
			':id' 			=> $this->db->generateGUID(),
			':created_by' 	=> $user['id'],
			':created_on' 	=> date('c'),
			':modified_by' 	=> null,
			':modified_on' 	=> null,

			':park_name' 	=> $course['park_name'],
			':city' 		=> $course['city'],
			':state' 		=> $course['state'],
			':zip' 			=> $course['zip'],
			':latitude' 	=> $course['latitude'],
			':longitude' 	=> $course['longitude']
		);

		return $this->db->Query($query, $values);
	}

	public function update($course)
	{
		//	Base Values on each update;
		$values = array(
			":id"				=> $course["id"]
		);

		$course["modified_on"] = date("c");

		//	Init Query
		$query = "UPDATE `Courses` SET ";

		//	Update query and values
		foreach ($course as $key => $value) {
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



	public function delete($course, $requestor)
	{ }

	//	For Delete
	public function getCreator()
	{ }


	/**
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


	//	Return Nearby Courses
	//	1 degree of Longitude = ~0.79585 * 69.172 = ~ 55.051 miles
	//	To find area  +/- xx.005
	//	Latitude for Calulations
	public function nearBy($course)
	{
		$values = array(
			':park_name' 	=> $course['park_name']
		);

		//	Workaround for Lat/Lng not being set; apply values and SQL Query if they are null
		$whereLatLng = "";
		if (!empty($course['latitude']) && !empty($course['longitude'])) {
			$whereLatLng = " (
				:lat_top > `latitude` AND :lat_bot < `latitude` AND
				:lng_top > `longitude` AND :lng_bot < `longitude`
			) OR ";

			//	Set Ranges
			$lat_top = (float) $course['latitude'] + 0.005;
			$lat_bot = (float) $course['latitude'] - 0.005;

			$lng_top = (float) $course['longitude'] + 0.005;
			$lng_bot = (float) $course['longitude'] - 0.005;

			//	Bind Values
			$values[':lat_top'] = $lat_top;
			$values[':lat_bot'] = $lat_bot;
			$values[':lng_top'] = $lng_top;
			$values[':lng_bot'] = $lng_bot;
		} else { }

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
		FROM `Courses` WHERE " . $whereLatLng . " LOWER(`park_name`) LIKE CONCAT('%%', :park_name, '%%')
		LIMIT 25";





		return $this->db->Query($query, $values);
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
