<?php
    session_start();
    if (!isset($_SESSION["admin"])) {
        header("Location: login.php");
        die();
    }
    require_once("rutas_fns.php");
    $rutas = getSecuencias();

    if (isset($_POST["sequence"]) && isset($_POST["estado"]) 
        && isset($_POST["ruta"]) && isset($_POST["inicio"]) 
        && isset($_POST["fin"]) && isset($_POST["final"]) 
        && isset($_POST["frontal"]) && isset($_POST["360"])) {
        // Cuando el usuario registre una nueva ruta
        $result = addRuta();
        $result_text = $result ? "Ruta agregada exitosamente" : "No se pudo registrar la ruta";
        $result_color = $result ? "green" : "red";
    }
    

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rutas de Evacuación del Volcán Popocatepetl</title>
    <!-- CCS -->
    <link rel="stylesheet" href="css/rutas.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!-- Materialize -->
        <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <!-- Compiled and minified JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <!-- Iconos -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
</head>
<body>
    <div class="container">
        <h3 class="center flow-text guinda white-text padded">
            <a class="left white btn-floating" href="./"><i class="material-icons guinda-text">home</i></a>
            Rutas de evacuación
        </h3>
        <?php if (isset($result)) { ?>
        <div class="row" id="div-result">
            <div class="col s12">
                <p class="center padded <?=$result_color?> white-text"><?=$result_text?>
                    <button id="btn-close" class="btn-floating right guinda" style="top:-10px;"><i class="material-icons prefix">close</i></button>
                </p>
            </div>
        </div>
        <?php } ?>
        <div class="row">
            Agregar ruta
            <button id="btn-add" class="btn-floating tooltipped guinda white-text" data-position="top" data-tooltip="Agregar ruta"><i class="material-icons prefix">add</i></button>
        </div>
        <div class="row" style="display:none">
            <h5 class="flow-text">Añadir ruta</h5>
            <form action="rutas.php" method="post">
                <div class="input-field col s12">
                    <input class="validate" type="text" name="sequence" id="sequence" required minlength="22" maxlength="22" data-length="22">
                    <label for="sequence">ID MAPILLARY</label>
                    <span class="helper-text" data-error="Ingresa un ID correcto (22 caracteres)" data-success="">Ingresa el ID generado para MAPILLARY</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="number" name="ruta" id="ruta" required min=1>
                    <label for="ruta">Número de ruta</label>
                    <span class="helper-text" data-error="Ingresa el número de la ruta" data-success="">Ingresa el número de la ruta</span>
                </div>
                <div class="input-field col s12">
                    <select class="validate" name="estado" id="estado" required>
                        <option disabled selected value="">Selecciona el estado</option>
                        <?php foreach (getEstados() as $key => $e) { ?>
                            <option value="<?=$e["ID_ESTADO"]?>"><?=$e["NOMBRE"]?></option>
                        <?php } ?>
                    </select>
                    <label for="estado">Entidad Federativa</label>
                    <span class="helper-text red-text" style="display:none;">Debes seleccionar la entidad federativa de la ruta</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="text" name="inicio" id="inicio" required>
                    <label for="inicio">Lugar de inicio</label>
                    <span class="helper-text" data-error="Ingresa donde inicial la ruta" data-success="">Ingresa donde inicial la ruta</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="text" name="fin" id="fin" required>
                    <label for="fin">Lugar final</label>
                    <span class="helper-text" data-error="Ingresa donde finaliza la ruta" data-success="">Ingresa donde finaliza la ruta</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="text" name="final" id="final" required>
                    <label for="final">Destino final de la ruta</label>
                    <span class="helper-text" data-error="Ingresa el destino final de la ruta" data-success="">Ingresa el destino final de la ruta</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="url" name="frontal" id="frontal" required>
                    <label for="frontal">URL del video frontal</label>
                    <span class="helper-text" data-error="Ingresa una URL válida" data-success="">Ingresa la URL del video de la cámara frontal</span>
                </div>
                <div class="input-field col s12">
                    <input class="validate" type="url" name="360" id="360" required>
                    <label for="360">URL del video 360</label>
                    <span class="helper-text" data-error="Ingresa una URL válida" data-success="">Ingresa la URL del video de la cámara 360</span>
                </div>
                <div class="col s12">
                    <button id="btn-form" class="btn dorado white-text" type="submit">Registrar ruta</button>
                    <button id="btn-back" class="btn guinda white-text" type="button">Cancelar</button>
                </div>
            </form>
        </div>
        <div class="divider"></div>
        <div id="tablas">
            <h5 class="flow-text">Listado de rutas registradas por año</h5>
            <div class="col s12">
                <ul class="tabs verde-oscuro" id="ul-tablas">
                    <li class="tab"><a class="white-text" href="#tabla-na">Sin definir</a></li>
                    
                </ul>
            </div>
            <div id="tabla-na" class="col s12">
                <table class="striped highlight responsive-table">
                    <thead>
                        <tr>
                            <th>ID MAPILLARY</th>
                            <th>RUTA</th>
                            <th>ESTADO</th>
                            <th>LUGAR INICIO</th>
                            <th>LUGAR FIN</th>
                            <th>DESTINO FINAL</th>
                            <th>ESTADO SECUNDARIO</th>
                            <th>RUTA SECUNDARIA</th>
                            <th>URL FRONTAL</th>
                            <th>URL 360</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
            
        </div>
        
    </div>
    <script src="./js/rutas.js"></script>
</body>
</html>