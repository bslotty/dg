<?php 

class SQL {
    protected $host;
    protected $db;
    protected $user;
    protected $pass;
    protected $charset;
    protected $dsn;

    public $stmt;
    public $pdo;
    public $data;


    //  Init
    public function __construct() {
        $this->host       = 'brandonslottycom.fatcowmysql.com';
        $this->db         = 'discing_1';
        $this->user       = 'dgadmin_1';
        $this->pass       = 'Slotty6702';
        $this->charset    = 'utf8mb4';
        $this->dsn        = "mysql:host=". $this->host . ";dbname=". $this->db .";charset=". $this->charset .";";
        
        $this->pdo = new PDO($this->dsn, $this->user, $this->pass);
    }

    //  Run Query and Return Data
    public function Query($q, $v) {
        if (!$this->stmt = $this->pdo->prepare($q)){
            return "Error with Query";
        } else if (!$this->stmt->execute($v)) {
            return "Error Executing [". $this->stmt->errorCode()."]: ". $this->stmt->errorInfo();
        } else {
            return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function Access($league, $user) {
        //  Verify Permissions
        $validUser = false;
        $query = "SELECT 
            `p`.`ID` AS `P.ID`, 
            `p`.`Level` AS `P.Level`,
            `p`.`Status` AS `P.Status`,
            `l`.`ID` AS `L.ID`, 
            `a`.`ID` AS `A.ID`,
            `a`.`First` AS `A.First`,
            `a`.`Last` AS `A.Last`,
            `a`.`Email` AS `A.Email`
        FROM `Permissions` AS `p`
        JOIN `Leagues` AS `l` ON `p`.`LeagueID`=`l`.`ID` 
        JOIN `Accounts` AS `a` ON `a`.`ID`=`p`.`UserID`
        WHERE `l`.`ID`=:leagueid AND `p`.`Status` <> 'rejected'
        ORDER BY `p`.`Level`, `p`.`Status`;";

        //  Set Values
        $values = array(
            ":leagueid" => $league["id"]
        );

        $data = $this->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status"=>"error",  
                "msg"=>"No Permissions Found"
            );
        } else {
            foreach ($data as $k => $o) {
                if ($o['A.ID'] == $user["id"] && ($o["P.Level"] == "moderator" || $o["P.Level"] == "creator")) {
                    $validUser = true;
                }
            }
        }

        if ($validUser != true) {
            $return = array(
                "status"=>"error",  
                "msg"=>"You do not have sufficent permissions to perform this action"
            );
        } else {
            $return = array(
                "status"=>"success",  
                "msg"=>"Valid User"
            );
        }

        return $return;
    }

}


        /*  Cascade Delete SQL Example:
            ALTER TABLE posts 
            ADD CONSTRAINT fk_cat 
            FOREIGN KEY (category_id) 
            REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE;
            



            View Keys:
            SELECT 
                TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_SCHEMA = 'discing_1' AND
                REFERENCED_TABLE_NAME = '<table>';



            Remove Key
            ALTER TABLE `table_name`
                DROP FOREIGN KEY `id_name_fk`;
                
                Stats_ibfk_2

        */

?>
