<?php

class Favorites
{

	//	Properties
	public $id;
	public $created_by;
	public $created_on;
	public $modified_by;
	public $modified_on;
	public $related_table;
	public $related_id;

	//	DB
	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}

    public function userList($user){
        $query = "SELECT * FROM `Favorites` WHERE `created_by`=:userId;";

        $values = array(
            ":userId" => $user["id"]
        );

        return $this->db->Query($query, $values);
    }

	public function create($fav, $user)
	{
		$query = "INSERT INTO `Favorites` 
		(`id`, `created_by`, `created_on`, `modified_by`, `modified_on`, `related_table`, `related_id` ) VALUES 
		(:id, :created_by, :created_on, :modified_by, :modified_on, :related_table, :related_id);";

		$values = array(
			':id' 			=> $this->db->generateGUID(),
			':created_by' 	=> $user['id'],
			':created_on' 	=> date('c'),
			':modified_by' 	=> null,
			':modified_on' 	=> null,

			':related_table' 	=> $fav['related_table'],
			':related_id' 		=> $fav['related_id'],
		);

		return $this->db->Query($query, $values);
	}

	public function delete($fav) 
	{
        $query = "DELETE
            FROM `Favorites` 
            WHERE `id`=:id
            LIMIT 1";

        $values = array(
            ":id" => $fav['id']
        );

        return $this->db->Query($query, $values);
	}
}
