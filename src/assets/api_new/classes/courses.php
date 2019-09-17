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
			`name`,
			`park_name`,
			`city`,
			`state`,
			`zip`,
			`latitude`,
			`longitude` 
		FROM `Courses`
		LIMIT " . (int)$start . ", " . (int)$limit . ";";

		$values = array();

		return $this->db->Query($query, $values);
	}

	public function getFavorites()
	{ }

	public function search($term, $start = 0, $limit = 100)
	{
		$query = "SELECT 
			`id`, 
			`created_by`,
			`created_on`,
			`modified_by`,
			`modified_on`,
			`name`,
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
			`zip`,
		)) LIKE CONCAT('%%', :term, '%%')
		LIMIT " . (int)$start . ", " . (int)$limit . ";";


		$values = array(
			":term" => strtolower($term)
		);

		return $this->db->Query($query, $values);
	}

	public function create($course)
	{
		$query = "INSERT INTO `Courses` 
		(`id`, `created_by`, `created_on`, `modified_by`, `modified_on`, `name`, `park_name`, `city`, `state`, `zip`, `latitude`, `longitude` ) VALUES 
		(:id, :created_by, :created_on, :modified_by, :modified_on, :name, :park_name, :city, :state, :zip, :latitude, :longitude);";

		$values = array(
			':id' 			=> $this->db->generateGUID(),
			':created_by' 	=> $course['created_by'],
			':created_on' 	=> date('c'),
			':modified_by' 	=> null,
			':modified_on' 	=> null,
			':name' 		=> $course['name'],
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
			if (!array_key_exists(":". $key, $values)) {
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
	{
			
	}

	//	For Delete
	public function getCreator()
	{ }
}
