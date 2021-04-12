const endpoint = "/sequences/";
const client_id = "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx";
// const mapillaryBase = "https://a.mapillary.com/v3";

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
    var rutas = [];
    var desfase = 0;

    var confirmed_count = 0;
    var error_count = 0;


    $.each(ids, function(index, r){
        // Solo para que no carque todas (DEVELOP mode)
        // if(index>50) return;
        semaphore++;
        id_seq = $(r).find('a').text();
        var ruta = $.ajax({
            url: mapillaryBase + endpoint + id_seq,
            type: "GET",
            data: {client_id: client_id },
            dataType: "json",
            success: function(response) {
                const fecha_creado = new Date(response["properties"]["captured_at"]);
                let year = fecha_creado.getFullYear();
                //Agrega usuario que cargó la ruta de Mapillary, solo para verificar que sea de "CENACOM"
                let user = response["properties"]["username"];
                if(user != "cenacom") user= '<p style="color: red;">'+response["properties"]["username"]+'</p>';
                $(r).next().html(user);
                
                tr = $(r).parent();
                if ($('#tabla-'+year).length > 0) {
                    $('#tabla-'+year+' tbody').append(tr.clone());
                }
                else {
                    $('#tablas').append('\
                    <div id="tabla-'+year+'" style="display:none" class="col s12">\
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
        })
        .then(function() { confirmed_count += 1; })
        .catch(function() {
            error_count += 1;
            // return Promise.reject(); // Return a rejected promise to avoid resolving the parent promise
        });
        rutas.push(ruta);  
    });

    Promise.all(rutas)
    .then(function() { 
        $("#loading").hide();
        $(".hideOnLoad").show();})
    .catch(function() { console.log(`Successful uploads: ${confirmed_count}. Failed uploads: ${error_count}`);   });
}

function escribeDatos(datos){
    // console.log(datos);
    $("#sequence").val(datos);
    $("#sequence").addClass("valid");
    $("#sequence").next().addClass("active");
}

$(document).ready(function(){
    M.AutoInit();

    $("#estado").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'}); // necesario para validar el select
    
    $('form').on('submit', function(e){
        return validaForm();
    });
    // Define el año en el que fue tomada la ruta
    
    rellenaTabla();
    

    $('.btn-add').on('click', function(){
        $('.divider').hide();
        $('form').parent().parent().show();
        // $(this).parent().hide();
        $('#tablas').hide('fast');
    });
    $('#btn-back').on('click', function(){
        $('.divider').show();
        $('form').parent().parent().hide();
        $('#btn-add').parent().show();
        $('#tablas').show('fast');
    });
    $('#btn-close').on('click', function(){
        $('#div-result').hide('fast');
    });

        //button menu volcano add map
    $('.fixed-action-btn').floatingActionButton({
        direction: 'right',
        hoverEnabled: false
    });
    $('.tooltipped').tooltip();
});


     
