const endpoint = "/sequences/";
const client_id = "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx";
const mapillaryBase = "https://a.mapillary.com/v3";

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
    const ids = $('#tabla-na tbody tr td:nth-child(1)');
    let semaphore = 0;
    $.each(ids, function(index, r){
        semaphore++;
        id_seq = $(r).find('a').text();
        $.ajax({
            url: mapillaryBase + endpoint + id_seq,
            type: "GET",
            data: {client_id: client_id },
            dataType: "json",
            success: function(response) {
                const fecha_creado = new Date(response["properties"]["captured_at"]);
                let year = fecha_creado.getFullYear();
    
                tr = $(r).parent();
                if ($('#tabla-'+year).length > 0) {
                    $('#tabla-'+year+' tbody').append(tr.clone());
                }
                else {
                    $('#tablas').append('\
                    <div id="tabla-'+year+'" class="col s12">\
                        <table class="striped highlight responsive-table">\
                            <thead>\
                                <tr>\
                                    <th>ID MAPILLARY</th>\
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
                    $('#tabla-'+year+' tbody').append(tr.clone());
                }
                tr.remove();
                semaphore--;
                if (semaphore == 0){
                    $('.tabs').tabs();
                }
                
            },
            error: function(error) {
                
                semaphore--;
                if (semaphore == 0){
                    $('.tabs').tabs();
                }
            }
        });

    })        
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