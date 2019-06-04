<?php
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');


    /*  Vars    */
    $method = $_SERVER['REQUEST_METHOD'];
    $return = [];

    //	SQL Resource
    require ($_SERVER['DOCUMENT_ROOT'] . '/disc/lib/sql.php');

    switch ($method) {
        case "GET":
    
        break;

        case "POST":
      
        break;

        case "PUT":

        break;

        case "DELETE":

        break;

        default:
            printf ("Unknown request type");
        break;
    }

    printf (json_encode( $return )) ;
?>