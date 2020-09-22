<?php
    session_start();
    require_once("db_fns.php");

    // ESTATUS DE SESION
    // 0 Usuario o contraseña incorrecto
    // 1 Iniciada correctamente
    // 2 Ya se había iniciado sesión

    if(isset($_POST['login']) && isset($_POST['username']) && isset($_POST['pwd'])) {
        $username = $_POST['username'];
        $pwd = $_POST['pwd'];

        if(!isset($_SESSION['admin'])){
            login($username, $pwd);
        }else{
            echo json_encode(["status" => "2", "message" => "Ya se había iniciado una sesión. Por favor, entra <a href='./logout.php'>aquí</a> para cerrar la sesión activa e intenta nuevamente."]);
        };
    };

    function login($username, $pwd) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);
       

        $paramsArray = Array(
            ":correo" => $username,
            ":pwd" => $pwd
        );

        $queryStr = "SELECT CORREO, NOMBRE, AP_PATERNO, AP_MATERNO FROM ADMINISTRADOR 
        WHERE LOWER(CORREO) = LOWER(:correo) AND PWD = :pwd AND ACTIVO = '1'";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        
        while ( ($row = oci_fetch_assoc($query)) != false) {
            $ar["correo"] = $row["CORREO"];
            $ar["name"] = $row["NOMBRE"];
            $ar["lastname"] = $row["AP_PATERNO"];
            $ar["surname"] = $row["AP_MATERNO"];
            $ar["status"] = 1;
            $ar["message"] = "Sesión iniciada";
        }
        
        if(isset($ar["correo"])) {
            //mandamos a la info de la sesión los datos del usuario
            $_SESSION['admin'] = $ar["correo"];
            $_SESSION['name'] = $ar["name"];
            $_SESSION['lastname'] = $ar["lastname"];
            $_SESSION['surname'] = $ar["surname"];
            ActHora($username);
            echo json_encode($ar);
        } else {
            $ar["status"] = 0;
            $ar["message"] = "Usuario o contraseña incorrectos";
            echo json_encode($ar);
        }
        dbClose($conn, $query);
    }

    function ActHora($dato) {
        $paramsArray = Array(
            ":correo" => $dato,
        );
        
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $queryStrDate = "UPDATE ADMINISTRADOR SET ULTIMO_ACCESO = SYSDATE WHERE LOWER(CORREO) = LOWER(:correo)";

        $query = oci_parse($conn, $queryStrDate);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }        

        oci_execute($query);

        dbClose($conn, $query);
        return true;
    }
?>