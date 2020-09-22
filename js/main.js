var view;
var map;
$(function() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Expand",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Home",
        "esri/widgets/Search",
        "esri/widgets/Locate",
        "esri/tasks/Locator",
        "esri/Graphic"
    ], function(
        Map,
        MapView,
        Expand,
        BasemapGallery,
        Home,
        Search,
        Locate,
        Locator,
        Graphic
    ) {
        map = new Map({ basemap: "hybrid" });

        view = new MapView({
            container: "map",
            map: map,
            center: [-98.6264,19.0266],
            // center: [-98.7662,19.1793],
            zoom: 9
        });

        const basemapGallery = new Expand({
            view: view,
            expandIconClass: "esri-icon-basemap",
            content: new BasemapGallery({
                view: view
            })
        });

        const homeWidget = new Home({ view: view });
        const locateWidget = new Locate({ view: view });
        const searchWidget = new Search({ view: view });

        view.ui.add(basemapGallery, "top-left");
        view.ui.add(homeWidget, "top-left");
        view.ui.add(locateWidget, "top-left");

        view.ui.add(searchWidget, "top-right");

        var locatorTask = new Locator({
            url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        view.popup.autoOpenEnabled = false;
        view.on("click", function(event) {
            var lat = event.mapPoint.latitude.toFixed(6);
            var lon = event.mapPoint.longitude.toFixed(6);

            const markerSymbol = {
                type: "simple-marker",
                style: "circle",
                color: [226, 119, 40],
                outline: {
                    color: [255, 255, 255],
                    width: 2
                }
            };

            const pointGraphic = new Graphic({
                geometry: event.mapPoint,
                symbol: markerSymbol
            });

            view.graphics.removeAll();
            view.graphics.add(pointGraphic);

            locatorTask
                .locationToAddress(event.mapPoint, 0, )
                .then(function(response) {
                    const attributes = response.attributes;

                    const street = attributes["Address"];
                    const postal = attributes["Postal"];
                    const neighborhood = attributes["Neighborhood"];
                    const county = attributes["City"];
                    const state = attributes["Region"]

                    const validStates = ["Ciudad de México", "México", "Morelos", "Puebla", "Tlaxcala"];
                    if(validStates.indexOf(state) == -1){
                        showMessage("Error", "El estado no esta dentro de las opciones válidas");
                        return;
                    }

                    const address = [street, neighborhood, postal, county, state].join(", ");
                    view.popup.open({
                        title: "Coordenadas: [" + lon + ", " + lat + "]",
                        location: event.mapPoint,
                        content: address
                    });

                    $("#reportStreet").val(street);
                    $("#reportNeighborhood").val(neighborhood);
                    $("#reportPostal").val(postal);
                    $("#reportCounty").val(county);
                    $("#reportState option:eq(" + (parseInt(validStates.indexOf(state)) + 1) + ")").prop("selected", true)
                    $("#reportLatitude").val(lat);
                    $("#reportLongitude").val(lon);

                    view.goTo({
                        target: event.mapPoint,
                        zoom: 17
                    });
                })
                .catch(function(error) {
                    view.popup.content = "No se encontró una dirección para este lugar";
                });
        });

        $("#refreshLocation").on("click", function() {
            var addressArray = [];

            if($("#reportStreet").val().trim() != "") addressArray.push($("#reportStreet").val().trim());
            if($("#reportNeighborhood").val().trim() != "") addressArray.push($("#reportNeighborhood").val().trim());
            if($("#reportPostal").val().trim() != "") addressArray.push($("#reportPostal").val().trim());
            if($("#reportCounty").val().trim() != "") addressArray.push($("#reportCounty").val().trim());
            if($("#reportState option:selected").val().trim() != "") addressArray.push($("#reportState option:selected").text());

            var address = { 
                address: { 
                    Region: $("#reportState option:selected").text(),
                    City: $("#reportCounty").val().trim(),
                    Postal: $("#reportPostal").val().trim(),
                    Neighborhood: $("#reportNeighborhood").val().trim(),
                    Address: $("#reportStreet").val().trim()
                } 
            };

            locatorTask
                .addressToLocations(address)
                .then(function(response) {
                    const markerSymbol = {
                        type: "simple-marker",
                        style: "circle",
                        color: [226, 119, 40],
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };

                    const point = {
                        type: "point",
                        longitude: parseFloat(response[0]["location"]["x"]).toFixed(6),
                        latitude: parseFloat(response[0]["location"]["y"]).toFixed(6)
                    }
        
                    const pointGraphic = new Graphic({
                        geometry: point,
                        symbol: markerSymbol
                    });
        
                    view.graphics.removeAll();
                    view.graphics.add(pointGraphic);
        
                    view.popup.open({
                        title: "Coordenadas [" + point["longitude"] + ", " + point["latitude"] + "]",
                        content: addressArray.join(", "),
                        location: point
                    });

                    view.goTo({
                        target: pointGraphic,
                        zoom: 17
                    });

                    $("#reportLatitude").val(point["latitude"]);
                    $("#reportLongitude").val(point["longitude"]);
                })
                .catch(function(error) {
                    view.popup.content = "No se encontró una dirección para este lugar";
                });;
        });
    });

    $("#reporta .tabElement").on("click", function() {
        $("#reporta .tabElement").removeClass("active");
        $(this).addClass("active");

        var tabId = parseInt($(this).attr("data-tabId"));
        $("#reporta .panel").removeClass("active");
        $($("#reporta .panel").get(tabId)).addClass("active");
    });

    $("#acciones .tabElement").on("click", function() {
        $("#acciones .tabElement").removeClass("active");
        $(this).addClass("active");

        var idEstado = parseInt($(this).attr("data-idEstado"));

        getAcciones(idEstado);
    });

    $("#submitForm").on("click", function(e) {
        e.preventDefault();

        if($("#reportImage").get(0).files.length == 0) {
            showMessage("Error", "Debes agregar una imagen");
            return;
        }
            
        if($("#reportDescription").val().trim() == "") {
            showMessage("Error", "Debes agregar una descripción");
            return;
        }

        if($("#reportState option:selected").val().trim() == "") {
            showMessage("Error", "Debes agregar una entidad federativa");
            return;
        }

        if($("#reportCounty").val().trim() == "") {
            showMessage("Error", "Debes agregar una municipio");
            return;
        }

        if($("#reportLatitude").val().trim() == "" || $("#reportLongitude").val().trim() == "") {
            showMessage("Error", "Los valores de coordenadas no pueden estar vacios. Da click sobre el mapa para obtener una coordenada o actualiza la ubicación de dirección.");
            return;
        }

        if($("#reportImage").get(0).files[0].size > 5242880) {
            showMessage("Error", "El tamaño máximo de la imagen es de 5MB.");
            return;
        }

        var file = $("#reportImage").get(0).files[0];
        var formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url        : 'saveFile.php',
            type       : 'POST',
            contentType: false,
            cache      : false,
            processData: false,
            data       : formData,
            dataType   : 'json',
            xhr        : function () {
                var jqXHR = null;
                if (window.ActiveXObject) {
                    jqXHR = new window.ActiveXObject( "Microsoft.XMLHTTP" );
                } else {
                    jqXHR = new window.XMLHttpRequest();
                }
                //Upload progress
                jqXHR.upload.addEventListener( "progress", function ( evt ) {
                    if ( evt.lengthComputable ) {
                        var percentComplete = Math.round((evt.loaded * 100) / evt.total);
                        //Do something with upload progress
                        console.log( 'Uploaded percent', percentComplete );
                    }
                }, false);
                return jqXHR;
            },
            success    : function ( data ) {
                if(data["errors"].length == 0)
                    addReport(data);
            },
            error: function(error) {
                console.log(err);
            }
        });
    });

    function addReport(imageInfo) {
        var imageUrl = imageInfo["uploaded"]["url"];
        var descripcion = $("#reportDescription").val().trim();
        var entidad = $("#reportState option:selected").val().trim();
        var municipio = $("#reportCounty").val().trim();
        var colonia = $("#reportNeighborhood").val().trim();
        var cp = $("#reportPostal").val().trim();
        var calle = $("#reportStreet").val().trim();
        var latitude = parseFloat($("#reportLatitude").val());
        var longitude = parseFloat($("#reportLongitude").val());
        var correo = $("#reportMail").val().trim();

        var params = {
            reporte: true,
            descripcion: descripcion,
            municipio: municipio,
            latitud: latitude,
            longitud: longitude,
            imageUrl: imageUrl,
            idEstado: entidad
        }

        if(colonia != "") params["colonia"] = colonia;
        if(cp != "") params["cp"] = cp;
        if(calle != "") params["calle"] = calle;
        if(correo != "") params["correo"] = correo;

        $.ajax({
            url: "rutas_fns.php",
            method: "POST",
            data: params,
            dataType: "json",
            success: function(data) {
                var message = {
                    title: "¡Gracias!",
                    message: "Tu información será revisada y se colocará en el mapa ciudadano."
                }

                var templateSource = $("#message-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(message);
                $('#messageContainer').html(outputHTML);

                $('#messageContainer').addClass("active");
                $('#messageContainer .buttonAccept').on("click", function() { 
                    $('#messageContainer').removeClass("active");

                    $("#reportImage").val("");
                    $("#reportDescription").val("");
                    $("#reportState option:eq(0)").prop("selected", true)
                    $("#reportCounty").val("");
                    $("#reportNeighborhood").val("");
                    $("#reportPostal").val("");
                    $("#reportStreet").val("");
                    $("#reportLatitude").val("");
                    $("#reportLongitude").val("");
                    $("#reportMail").val("");
                });
                
            },
            error: function(error) {
                console.log(error)
            }
        });
    }

    function showMessage(title, message) {
        var string = title + "\n" + message;
        alert(string);
    }

    function getAcciones(idEstado) {
        var params = {
            acciones: "",
            state: parseInt(idEstado)
        };

        $.ajax({
            url: "rutas_fns.php",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (data) {
                var templateSource = $("#acciones-template").html();
                var template = Handlebars.compile(templateSource);
                var templateHTML = template(data);
                $('#panelsContainer').html(templateHTML);

                twttr.widgets.load();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    var min = 1;
    var max = 6;
    var tabActive = Math.floor(Math.random() * (max - min)) + min

    //$("#acciones .tabElement").get(tabActive - 1).click();
    $("#reporta .tabElement").get(0).click();
});