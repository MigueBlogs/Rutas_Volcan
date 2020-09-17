<?php
    require_once("db_fns.php");

    if(isset($_GET['acciones']) && isset($_GET['state'])) {
        $state = (int)$_GET['state'];

        getAcciones($state);
    } else if(isset($_POST['reporte']) && isset($_POST['descripcion']) && isset($_POST['municipio']) 
    && isset($_POST['latitud']) && isset($_POST['longitud']) && isset($_POST['imageUrl']) 
    && isset($_POST['idEstado'])) {
        $descripcion = $_POST['descripcion'];
        $idEstado = intval($_POST['idEstado']);
        $municipio = $_POST['municipio'];
        $latitud = floatval($_POST['latitud']);
        $longitud = floatval($_POST['longitud']);
        $imageUrl = $_POST['imageUrl'];

        $optionals = Array();

        if(isset($_POST['colonia'])) $optionals['colonia'] = $_POST['colonia'];
        if(isset($_POST['correo'])) $optionals['correo'] = $_POST['correo'];
        if(isset($_POST['cp'])) $optionals['cp'] = $_POST['cp'];
        if(isset($_POST['calle'])) $optionals['calle'] = $_POST['calle'];

        addReport($idEstado, $municipio, $latitud, $longitud, $imageUrl, $descripcion, $optionals);
    } else if(isset($_GET['allreports'])) {
        getReports();
    } else if(isset($_GET['sequenceId'])) {
        $sequenceId = $_GET['sequenceId'];

        getSecuencia($sequenceId);
    }

    function getAcciones($state) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":state" => $state
        );

        $queryStr = "SELECT DESCRIPCION, URL, ID_CATEGORIA ".
            "FROM ACCION ".
            "WHERE ID_ESTADO = :state ".
            "ORDER BY ID_ACCION DESC";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = [
            "acciones" => Array()
        ];

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $result = Array();
            $result["descripcion"] = $row["DESCRIPCION"] != "" ? $row["DESCRIPCION"]->load() : "";
            $result["url"] = $row["URL"];
            $result["categoria"] = $row["ID_CATEGORIA"];

            $ar["acciones"][] = $result;
        }

        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function getSecuencia($sequenceId) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":sequenceId" => $sequenceId
        );

        $queryStr = "SELECT ID_SECUENCIA, RUTA, LUGAR_INICIO, LUGAR_FIN, DESTINO_FINAL, URL_FRONTAL, URL_360 ".
            "FROM RUTAS ".
            "WHERE ID_SECUENCIA = :sequenceId ";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = [];

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $result = Array();
            $result["idSecuencia"] = $row["ID_SECUENCIA"];
            $result["ruta"] = $row["RUTA"];
            $result["lugarInicio"] = $row["LUGAR_INICIO"];
            $result["lugarFin"] = $row["LUGAR_FIN"];
            $result["destinoFinal"] = $row["DESTINO_FINAL"];
            $result["urlFrontal"] = $row["URL_FRONTAL"];
            $result["url360"] = $row["URL_360"];

            $ar[] = $result;
        }

        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function addReport($idEstado, $municipio, $latitud, $longitud, $imageUrl, $descripcion, $optionals) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idEstado" => $idEstado,
            ":municipio" => $municipio,
            ":latitud" => $latitud,
            ":longitud" => $longitud,
            ":imageUrl" => $imageUrl,
            ":descripcion" => $descripcion
        );

        $queryStr = "INSERT INTO REPORTE (ID_ESTADO, MUNICIPIO, LATITUD, LONGITUD, IMAGEN_URL, DESCRIPCION ";
        $queryStrValues = ") VALUES (:idEstado, :municipio, :latitud, :longitud, :imageUrl, :descripcion";

        if(isset($optionals['colonia'])) {
            $paramsArray[":colonia"] = $optionals['colonia'];
            $queryStr .= ", COLONIA";
            $queryStrValues .= ", :colonia";
        }
        if(isset($optionals['cp'])) {
            $paramsArray[":cp"] = $optionals['cp'];
            $queryStr .= ", CP";
            $queryStrValues .= ", :cp";
        }

        if(isset($optionals['calle'])) {
            $paramsArray[":calle"] = $optionals['calle'];
            $queryStr .= ", CALLE";
            $queryStrValues .= ", :calle";
        }

        if(isset($optionals['correo'])) {
            $paramsArray[":correo"] = $optionals['correo'];
            $queryStr .= ", CORREO";
            $queryStrValues .= ", :correo";
        }

        $queryStr .= $queryStrValues.")";
        $query = oci_parse($conn, $queryStr);
        
        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        dbClose($conn, $query);

        echo json_encode(["message" => "Registro insertado"]);
    }

    function getReports(){
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array();

        $queryStr = "SELECT DESCRIPCION, MUNICIPIO, COLONIA, CP, CALLE, LATITUD, LONGITUD, IMAGEN_URL ".
            "FROM REPORTE ".
            "WHERE REVISADO = '1' ".
            "ORDER BY ID_REPORTE";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = [
            "reportes" => Array()
        ];

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $result = Array();
            $result["descripcion"] = $row["DESCRIPCION"];
            $result["municipio"] = $row["MUNICIPIO"];
            $result["colonia"] = $row["COLONIA"] ? $row["COLONIA"] : "";
            $result["cp"] = $row["CP"] ? $row["CP"] : "";
            $result["calle"] = $row["CALLE"] ? $row["CALLE"] : "";
            $result["latitud"] = floatval($row["LATITUD"]);
            $result["longitud"] = floatval($row["LONGITUD"]);
            $result["imagenUrl"] = $row["IMAGEN_URL"];

            $ar["reportes"][] = $result;
        }

        dbClose($conn, $query);
        echo json_encode($ar);
    }
?>