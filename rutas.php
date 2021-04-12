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
        && isset($_POST["fin"]) && isset($_POST["final"])) {
        // && isset($_POST["frontal"]) && isset($_POST["360"])) { // estos parámetros son opcionales para la BD
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
    <link rel="stylesheet" href="https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.css">
    <link rel="stylesheet" href="https://js.arcgis.com/4.13/esri/css/main.css">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="stylesheet" href="./css/slider.css">

    <script src="https://js.arcgis.com/4.13/"></script>
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
            <div class="col s6">
                <div class="fixed-action-btn navSup">
                    <a class="btn-floating btn-large red tooltipped" data-position="bottom" data-tooltip="Agregar Ruta">
                        <i class="large material-icons">add</i>
                    </a>
                    <ul>
                        <li><a class="btn-add btn-floating yellow darken-1 tooltipped" data-position="bottom" center=[-98.631821,19.014735] data-tooltip="Volcán Popocatépetl"><i class="material-icons">filter_hdr</i></a></li>
                        <li><a class="btn-add btn-floating green tooltipped" data-position="bottom" center=[-103.608971,19.519993] data-tooltip="Volcán de Fuego"><i class="material-icons">whatshot</i></a></li>
                        <li><a class="btn-add btn-floating blue tooltipped" data-position="bottom" center=[-93.189812,17.377836] data-tooltip="Volcán Chiapas"><i class="material-icons">photo_size_select_actual</i></a></li>
                    </ul>
                </div>
                <!-- <button id="btn-add" class="btn-floating tooltipped guinda white-text" data-position="top" data-tooltip="Agregar ruta"><i class="material-icons prefix">add</i></button> -->
            </div>
            <div class="col s6">
                <img src="./images/main_logo.jpg" style="height:auto; max-height: 4em;" alt="DAE" class="right">
            </div>
        </div>
        <div class="row flex" style="display:none">
        <!-- <div class="row flex" style=""> -->
            <div class="col s6 colForm">
                <h5 class="flow-text">Añadir ruta</h5>
                <form action="rutas.php" method="post">
                    <div class="input-field col s12">
                        <input class="validate" readonly type="text" name="sequence" id="sequence" required minlength="22" maxlength="22" data-length="22">
                        <label for="sequence">ID MAPILLARY</label>
                        <span class="helper-text" data-error="Ingresa un ID correcto (22 caracteres)" data-success="">Haz click en el mapa para obtener el ID generado por MAPILLARY</span>
                    </div>
                    <div class="input-field col s12">
                        <input class="validate" type="number" name="ruta" id="ruta" required min=1>
                        <label for="ruta">Número de ruta</label>
                        <span class="helper-text" data-error="Ingresa el número de la ruta" data-success="">Ingresa el número de la ruta (Número únicamente)</span>
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
                        <input class="validate" type="url" name="frontal" id="frontal">
                        <label for="frontal">URL del video frontal</label>
                        <span class="helper-text" data-error="Ingresa una URL válida" data-success="">Ingresa la URL del video de la cámara frontal</span>
                    </div>
                    <div class="input-field col s12">
                        <input class="validate" type="url" name="360" id="360">
                        <label for="360">URL del video 360</label>
                        <span class="helper-text" data-error="Ingresa una URL válida" data-success="">Ingresa la URL del video de la cámara 360</span>
                    </div>
                    <div class="input-field col s12">
                        <select class="validate" name="estado-sec" id="estado_sec">
                            <option selected value="">Selecciona el estado</option>
                            <?php foreach (getEstados() as $key => $e) { ?>
                                <option value="<?=$e["ID_ESTADO"]?>"><?=$e["NOMBRE"]?></option>
                            <?php } ?>
                        </select>
                        <label for="estado_sec">Entidad Federativa Secundario</label>
                        <span class="helper-text red-text" style="display:none;">Debes seleccionar la entidad federativa de la ruta secundaria</span>
                    </div>
                    <div class="input-field col s12">
                        <input class="validate" type="number" name="ruta-sec" id="ruta_sec" min=1>
                        <label for="ruta_sec">Número de ruta secundaria</label>
                        <span class="helper-text" data-error="Ingresa el número de la ruta" data-success="">Ingresa el número de la ruta secundaria (Un solo número únicamente)</span>
                    </div>
                    <div class="col s12">
                        <button id="btn-form" class="btn dorado white-text" type="submit">Registrar ruta</button>
                        <button id="btn-back" class="btn guinda white-text" type="button">Cancelar</button>
                    </div>
                </form>
            </div>
            <div class="col s6 colForm">
                Navega y selecciona la ruta en el mapa al que deseas añadir videos e información
                <div id="mapillaryMap">
                    <!-- <div class="slidecontainer" id="slidecontainer" disabled="disabled">
                        <p style="margin: 0;">Seleccionar rutas por año</p>
                        <div style="margin:auto;width: 50%;text-align: center;">
                            <label id="slider-value">2020</label>
                        </div>
                        <input type="range" min="2019" max="2020" value="2020" id="slider" class="slider" disabled="disabled">
                        <label id="slider-min" for="slider" style="float: left;">2019</label>
                        <label id="slider-max" for="slider" style="float: right;">2020</label>
                    </div> -->
                </div>
            </div>
            
        </div>
        <div class="divider"></div>
        <div id="tablas" style="">
            <h5 class="flow-text">Listado de rutas registradas por año</h5>
            <div class="col s12">
                <ul class="tabs tabs-fixed-width verde-oscuro" id="ul-tablas">
                    <li class="tab"><a class="white-text" href="#tabla-na">Sin definir</a></li>
                </ul>
            </div>
            <img id="loading" src="./images/loading2.gif" style="width: 100%;">
            <div id="tabla-na" class="col s12" style="display:none">
                <table class="striped highlight responsive-table">
                    <thead>
                        <tr>
                            <th>ID MAPILLARY</th>
                            <th>USUARIO</th>
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
                    <tbody class="hideOnLoad" style="display:none;">
                        <?php 
                        foreach ($rutas as $key => $value) { ?>
                        <tr>
                            <td class="breakword"><a href="<?=$value["idSecuencia"]?>" target="_blank" rel="noopener noreferrer"><?=$value["idSecuencia"]?></a></td>
                            <td>-</td>
                            <td><?=$value["ruta"]?></td>
                            <td><?=$value["estado"]?></td>
                            <td><?=$value["lugarInicio"]?></td>
                            <td><?=$value["lugarFin"]?></td>
                            <td><?=$value["destinoFinal"]?></td>
                            <td><?=$value["estadoSec"]?></td>
                            <td><?=$value["rutaSec"]?></td>
                            <td class="center"><?=$value["urlFrontal"] ? '<a href="$value["urlFrontal"]" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></a>': '' ?></td>
                            <td class="center"><?=$value["url360"] ? '<a href="$value["url360"]" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></a>': '' ?></td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
            
        </div>
        
    </div>
    <script src="./js/rutas.js"></script>
    <script src="./js/mapillaryRutas.js"></script>
</body>
</html>