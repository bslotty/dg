<?php


class DB
{

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
    public function __construct()
    {
        $this->getConnection();
    }

    // get the database connection
    public function getConnection(): void
    {
        $this->connection = null;
        
        $this->host           = "brandonslottycom.fatcowmysql.com";
        $this->username       = "dg_admin_1";
        $this->password       = "bd7699b83a29babe1852027a3538d4a2";
        $this->database       = "discing_2";
        $this->charset        = 'utf8mb4';
        $this->dsn            = "mysql:host=". $this->host . ";dbname=". $this->database .";charset=". $this->charset .";";
    

        try {
            $this->pdo = new PDO($this->dsn, $this->username, $this->password);
        } catch (PDOException $exception) {
            echo "Error: " . $exception->getMessage();
        }
    }

    //  Generate GUID
    public function generateGUID()
    {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        } else {
            $data = openssl_random_pseudo_bytes(16);
            $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
            return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
        }
    }

	//	Easy Return Last ID
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }



    //  Run Query and Return Data
    public function Query($q, $v)
    {
        $payload = array();

        if (!$this->stmt = $this->pdo->prepare($q)) {
            $payload = array(
                "status"    => "error",
                /*
                "code"      => "-1",
                "phase"     => "prepare",
                */
                "message"   => "Error with query",
                "debug"     => array(
                    "q"     => $q,
                    "v"     => $v
                )
            );
        } else if (!$this->stmt->execute($v)) {
            $payload = array(
                "status"    => "error",
                "code"      => $this->stmt->errorCode(),
                "phase"     => "execute",
                "message"   => $this->stmt->errorInfo(),
                "debug"     => array(
                    "q"     => $q,
                    "v"     => $v
                )
            );
        } else {

            $payload = array(
                "status"        => "success",
                /*
                "code"          => "0",
                "phase"         => "end",
                */
                "message"       => "success",
                "affectedRows"  =>  $this->stmt->rowCount(),
                "results"       =>  $this->stmt->fetchAll(PDO::FETCH_ASSOC)
            );
        }

        return $payload;
    }

    public function Access($league, $user) {
        //  Verify Permissions
        $validUser = false;
        $query = "SELECT 
            `p`.`ID` 		AS `P.ID`, 
            `p`.`Level` 	AS `P.Level`,
            `p`.`Status` 	AS `P.Status`,
            `l`.`ID` 		AS `L.ID`, 
            `a`.`ID` 		AS `A.ID`,
            `a`.`First` 	AS `A.First`,
            `a`.`Last` 		AS `A.Last`,
            `a`.`Email` 	AS `A.Email`
        FROM `Permissions` 	AS `p`
        JOIN `Leagues` 		AS `l` ON `p`.`LeagueID`=`l`.`ID` 
        JOIN `Accounts` 	AS `a` ON `a`.`ID`=`p`.`UserID`
        WHERE `l`.`ID`=:leagueid AND `p`.`Status` <> 'rejected'
        ORDER BY `p`.`Level`, `p`.`Status`;";

        //  Set Values
        $values = array(
            ":leagueid" => $league["id"]
        );

        $data = $this->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status" => "error",
                "msg" => "No Permissions Found"
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
                "status" => "error",
                "msg" => "You do not have sufficent permissions to perform this action"
            );
        } else {
            $return = array(
                "status" => "success",
                "msg" => "Valid User"
            );
        }

        return $return;
    }
}
?>