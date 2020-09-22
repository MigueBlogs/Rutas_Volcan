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
                        let year = fecha_creado.getFullYear();
                        switch (year) {
                            case 2019:
                                $('#tabla-2019 tbody').append('<tr>\
                                <td>'+r["idSecuencia"]+'</td>\
                                <td>'+r["ruta"]+'</td>\
                                <td>'+r["lugarInicio"]+'</td>\
                                <td>'+r["lugarFin"]+'</td>\
                                <td>'+r["destinoFinal"]+'</td>\
                                <td>'+r["urlFrontal"]+'</td>\
                                <td>'+r["url360"]+'</td></tr>'
                                );
                                break;
                            case 2020:
                                $('#tabla-2020 tbody').append('<tr>\
                                <td>'+r["idSecuencia"]+'</td>\
                                <td>'+r["ruta"]+'</td>\
                                <td>'+r["lugarInicio"]+'</td>\
                                <td>'+r["lugarFin"]+'</td>\
                                <td>'+r["destinoFinal"]+'</td>\
                                <td>'+r["urlFrontal"]+'</td>\
                                <td>'+r["url360"]+'</td></tr>'
                                );
                                break;
                            default:
                                $('#tabla-na tbody').append('<tr>\
                                <td>'+r["idSecuencia"]+'</td>\
                                <td>'+r["ruta"]+'</td>\
                                <td>'+r["lugarInicio"]+'</td>\
                                <td>'+r["lugarFin"]+'</td>\
                                <td>'+r["destinoFinal"]+'</td>\
                                <td>'+r["urlFrontal"]+'</td>\
                                <td>'+r["url360"]+'</td></tr>'
                                );
                                break;
                        }
                        
                    },
                    error: function(error) {
                        $('#tabla-na tbody').append('<tr>\
                            <td>'+r["idSecuencia"]+'</td>\
                            <td>'+r["ruta"]+'</td>\
                            <td>'+r["lugarInicio"]+'</td>\
                            <td>'+r["lugarFin"]+'</td>\
                            <td>'+r["destinoFinal"]+'</td>\
                            <td>'+r["urlFrontal"]+'</td>\
                            <td>'+r["url360"]+'</td></tr>'
                        );
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