const endpoint = "/sequences/";
const client_id = "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx";
const mapillaryBase = "https://a.mapillary.com/v3/";

function validaForm() {
    if ($('#sequence').val().trim() == "" || $('#sequence').val().length != 22){
        return false;
    }
    if ($('#estado').val().trim() == "" || $('#estado').val() <= 0 || $('#estado').val() > 32){
        return false;
    }
    if ($('#ruta').val().trim() == "" || $('#ruta').val() <= 0){
        return false;
    }
    if ($('#inicio').val().trim() == ""){
        return false;
    }
    if ($('#fin').val().trim() == ""){
        return false;
    }
    if ($('#final').val().trim() == ""){
        return false;
    }
    if ($('#frontal').val().trim() == ""){
        return false;
    }
    if ($('#360').val().trim() == ""){
        return false;
    }
    return true;
}

function rellenaTabla() {
    $.ajax({
        url: "./rutas_fns.php",
        method: "GET",
        data: {sequences: true},
        dataType: "json",
        success: function(data) {
            data.forEach((r) => {
                
                $.ajax({
                    url: mapillaryBase + endpoint + r["idSecuencia"],
                    type: "GET",
                    data: {client_id: client_id },
                    dataType: "json",
                    success: function(response) {
                        const fecha_creado = new Date(response["properties"]["captured_at"]);
                        // console.log(response["properties"]["username"]);
                        // debugger
                        let year = fecha_creado.getFullYear();
                        let user = response["properties"]["username"];
                        if(user != "cenacom") user= '<p style="color: red;">'+response["properties"]["username"]+'</p>';
                        let tmp = '<tr>\
                        <td>'+r["idSecuencia"]+'</td>\
                        <td>'+user+'</td>\
                        <td>'+r["ruta"]+'</td>\
                        <td>'+r["estado"]+'</td>\
                        <td>'+r["lugarInicio"]+'</td>\
                        <td>'+r["lugarFin"]+'</td>\
                        <td>'+r["destinoFinal"]+'</td>';
                        
                        tmp += r["estadoSec"] ? '<td>' + r["estadoSec"] + '</td>' : '<td></td>';
                        tmp += r["rutaSec"] ? '<td>' + r["rutaSec"] + '</td>' : '<td></td>';
                        
                        if (r["urlFrontal"]) {
                            tmp += '<td class="center"><a href="'+r["urlFrontal"]+'" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></a></td>';
                        }
                        else {
                            tmp += '<td></td>'
                        }
                        if (r["url360"]) {
                            tmp += '<td class="center"><a href="'+r["url360"]+'" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></td>';
                        }
                        else {
                            tmp += '<td></td>'
                        }

                        if ($('#tabla-'+year).length > 0) {
                            $('#tabla-'+year+' tbody').append(tmp);
                        }
                        else {
                            $('#tablas').append('\
                            <div id="tabla-'+year+'" class="col s12">\
                                <table class="striped highlight responsive-table">\
                                    <thead>\
                                        <tr>\
                                            <th>ID MAPILLARY</th>\
                                            <th>USUARIO</th>\
                                            <th>RUTA</th>\
                                            <th>ESTADO</th>\
                                            <th>LUGAR INICIO</th>\
                                            <th>LUGAR FIN</th>\
                                            <th>DESTINO FINAL</th>\
                                            <th>ESTADO SECUNDARIO</th>\
                                            <th>RUTA SECUNDARIA</th>\
                                            <th>URL FRONTAL</th>\
                                            <th>URL 360</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>\
                                    </tbody>\
                                </table>\
                            </div>');
                            $('#ul-tablas').append('\
                            <li class="tab"><a class="white-text" href="#tabla-'+year+'">'+year+'</a></li>\
                            ');
                            //$('#tabla-na tbody').append(tmp);
                        }
                        
                    },
                    error: function(error) {
                        console.log(error);
                        let tmp = '<tr>\
                        <td>'+r["idSecuencia"]+'</td>\
                        <td> - </td>\
                        <td>'+r["ruta"]+'</td>\
                        <td>'+r["estado"]+'</td>\
                        <td>'+r["lugarInicio"]+'</td>\
                        <td>'+r["lugarFin"]+'</td>\
                        <td>'+r["destinoFinal"]+'</td>';
                        tmp += r["estadoSec"] ? '<td>' + r["estadoSec"] + '</td>' : '<td></td>';
                        tmp += r["rutaSec"] ? '<td>' + r["rutaSec"] + '</td>' : '<td></td>';
                        if (r["urlFrontal"]) {
                            tmp += '<td class="center"><a href="'+r["urlFrontal"]+'" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></a></td>';
                        }
                        else {
                            tmp += '<td class="center"></td>'
                        }
                        if (r["url360"]) {
                            tmp += '<td class="center"><a href="'+r["url360"]+'" target="_blank"><i class="material-icons prefix guinda-text">play_circle_outline</i></td>';
                        }
                        else {
                            tmp += '<td class="center"></td>'
                        }
                        $('#tabla-na tbody').append(tmp);
                    }
                });
            });

        },
        error: function() {

        }
    });
}

$(document).ready(function(){
    M.AutoInit();

    $("#estado").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'}); // necesario para validar el select
    
    $('form').on('submit', function(e){
        return validaForm();
    });

    rellenaTabla();
    setTimeout(function() {
        $('.tabs').tabs();
    }, 3000)

    $('#btn-add').on('click', function(){
        $('form').parent().show();
        $(this).parent().hide();
        $('#tablas').hide('fast');
    });
    $('#btn-back').on('click', function(){
        $('form').parent().hide();
        $('#btn-add').parent().show();
        $('#tablas').show('fast');
    });
    $('#btn-close').on('click', function(){
        $('#div-result').hide('fast');
    });
});