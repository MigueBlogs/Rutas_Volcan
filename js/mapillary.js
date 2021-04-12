var map;
var view;
var selected_year = 2020;

const mapillaryBase = "https://a.mapillary.com/v3/";
var loading = false;

$(function() {
    $('#slider-value').text("Cargando "+selected_year);
    $('#slider-min').text($('#slider').attr("min"));
    $('#slider-max').text($('#slider').attr("max"));
    $('#slider').val(selected_year);
    $('#slider').on('change', function() {
        if (this.value != selected_year && !loading){
            console.log("Cambiando de año: "+ this.value);
            
            loading = true;
            selected_year = this.value;
            $('#slider-value').text("Cargando "+this.value);
            $('#slidecontainer').attr("disabled", true);
            this.disabled = true;
            loadSequences(map, view);
        }
    })
    function loadMap() {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Expand",
            "esri/widgets/BasemapGallery",
            "esri/widgets/Home",
            "esri/widgets/Search",
            "esri/widgets/Locate",
            "esri/layers/FeatureLayer",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Slider",
            "esri/widgets/Fullscreen"
        ], function(
            Map,
            MapView,
            Expand,
            BasemapGallery,
            Home,
            Search,
            Locate,
            FeatureLayer,
            GraphicsLayer,
            Slider,
            Fullscreen
        ) {
            map = new Map({ basemap: "hybrid" });
    
            view = new MapView({
                container: "mapillaryMap",
                map: map,
                // center: [-102,19.0266],
                center: [-98.634314,19.014356], 
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
            const FullScreenWidget = new Fullscreen({ view: view });
            // const slider = new Slider({
            //     container: "slider",
            //     min: 2019,
            //     max: 2020,
            //     values: [ 2020 ],
            //     steps: 1,
            //     visibleElements: {
            //         rangeLabels: true,
            //         labels: true
            //     }
            // });
    
            view.ui.add(basemapGallery, "top-left");
            view.ui.add(homeWidget, "top-left");
            view.ui.add(locateWidget, "top-left");
    
            view.ui.add(searchWidget, "top-right");
            view.ui.add(FullScreenWidget, "top-right");
            // view.ui.add(slider, "bottom-right")
    
            // slider.on("thumb-drag", sliderChanged);
    
            // function sliderChanged(event) {
            //     if (event.state == "stop" && event.value != selected_year && !loading){
            //         selected_year = event.value;
            //         loading = true;
            //         loadSequences(map, view);
            //     }
            // }
    
            const refugiosRenderer = {
                type: "unique-value",  // autocasts as new UniqueValueRenderer()
                field: "estado",
                defaultSymbol: {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    style: "circle",
                    color: "black",
                    size: "8px",  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: [ 255, 255, 255 ],
                        width: 1  // points
                    }
                },  // autocasts as new SimpleFillSymbol()
                uniqueValueInfos: [
                    {
                        value: "PUEBLA",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "blue",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }, {
                        value: "MORELOS",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "orange",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }, {
                        value: "ESTADO DE MÉXICO",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "green",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }, {
                        value: "TLAXCALA",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "pink",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }, {
                        value: "JALISCO",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "yellow",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }, {
                        value: "COLIMA",
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: "red",
                            size: "8px",  // pixels
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [ 255, 255, 255 ],
                                width: 1  // points
                            }
                        }
                    }
                ]
            };
    
            const refugiosLayer = new FeatureLayer({
                id: "refugios",
                url: "http://rmgir.proyectomesoamerica.org/server/rest/services/Hosted/Refugios_Temporales_(Popocat%C3%A9petl_y_Fuego)_200214/FeatureServer/0",
                outFields: ["*"],
                renderer: refugiosRenderer
            });
    
            const routesFields = [
                {
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                },
                {
                    name: "captured_at",
                    alias: "Fecha de captura",
                    type: "string"
                },
                {
                    name: "key",
                    alias: "Id de secuencia",
                    type: "string"
                },
                {
                    name: "username",
                    alias: "Usuario",
                    type: "string"
                },
                {
                    name: "created_at",
                    alias: "Fecha de creación",
                    type: "string"
                },
                {
                    name: "user_key",
                    alias: "Id de Usuario",
                    type: "string"
                }
            ];
    
            var routeTemplate = {
                title: "Ruta de evacuación",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "captured_at",
                                label: "Fecha de captura"
                            },
                            {
                                fieldName: "username",
                                label: "Usuario"
                            },
                            {
                                fieldName: "key",
                                label: "Llave de secuencia"
                            }
                        ]
                    }
                ]
            };
    
            const routeRenderer = {
                type: "simple",  // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-line",
                    width: 4,
                    color:  [255, 0, 0]
                }
            };
    
            var mapillaryRouteLayer = new FeatureLayer({
                id: "mapillarySequences",
                fields: routesFields,
                geometryType: "polyline",
                popupTemplate: routeTemplate,
                renderer: routeRenderer,
                source: [],
            });
    
            var mapillaryRoutePointsLayer = new GraphicsLayer({
                id: "mapillarySequencePoints"
            });
    
            var mapillaryRoutePointActiveLayer = new GraphicsLayer({
                id: "mapillarySequencePointActive"
            });
    
            map.layers.add(mapillaryRouteLayer);
            map.layers.add(mapillaryRoutePointsLayer);
            map.layers.add(mapillaryRoutePointActiveLayer);
            map.layers.add(refugiosLayer);
    
            loadSequences(map, view);
    
            view.on("click", function(event) {
                view.hitTest(event).then(function(response) {
                    if (!response.results.length) {
                        return;
                    }
                    let graphic = response.results.filter(function(result) {
                        return result.graphic.layer.id === "mapillarySequences";
                    })[0].graphic;
    
                    var sequenceId = graphic["attributes"]["key"];
                    view.goTo(graphic, { duration: 1500 });
                    console.log("Obteniendo Info");
                    console.log(graphic["attributes"]);
                    console.log(sequenceId);
                    // escribeDatos(sequenceId);
                    
                    getSequenceInfo(map, view, event.mapPoint, sequenceId);
                });
            });
        });
    }
    
    function getSequenceInfo(map, view, mapPoint, sequenceId) {
        require([
            "esri/Graphic"
        ], function(
            Graphic
        ) {
            const endpoint = "/sequences/" + sequenceId;
            const parameters = {
                client_id: "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx"
            };
    
            $.ajax({
                url: mapillaryBase + endpoint,
                type: "GET",
                data: parameters,
                dataType: "json",
                success: function(data) {
                    var image_keys = data["properties"]["coordinateProperties"]["image_keys"];
                    var coordinates = data["geometry"]["coordinates"];
                    const firstImageKey = image_keys[0];
                    const fecha_creado = new Date(data["properties"]["captured_at"]);
    
                    var graphics = [];
                    image_keys.forEach(function(imagePoint, imagePointIdx) {
                        const properties = {
                            image_key: imagePoint
                        };
    
                        const point = {
                            type: "point",
                            longitude: coordinates[imagePointIdx][0],
                            latitude: coordinates[imagePointIdx][1],
                        };
                          
                        var pointSymbol = {
                            type: "simple-marker",
                            color: "yellow",
                            size: 8,
                            outline: { // autocasts as new SimpleLineSymbol()
                                width: 0.5,
                                color: "white"
                            }
                        };
                          
                          
                        var polylineAtt = properties;  
                        graphics.push(new Graphic({
                            geometry: point,
                            symbol: pointSymbol,
                            attributes: polylineAtt
                        }));
                    });
    
                    var layer = map.findLayerById("mapillarySequencePoints");
                    layer.graphics.removeAll();
                    layer.addMany(graphics);
                    createMapillaryView(map, view, mapPoint, sequenceId, firstImageKey, fecha_creado.toLocaleDateString());
                },
                error: function(error) {
                    console.log("error");
                    console.log(error);
                }
            });
        });
    }
    
    function createMapillaryView(map, view, mapPoint, sequenceId, firstImageKey, fecha) {
        require([
            "esri/Graphic",
            "https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.js"
        ], function(
            Graphic,
            Mapillary
        ) {
            const parameters = {
                sequenceId: sequenceId
            }
    
            $.ajax({
                url: 'rutas_fns.php',
                type: "GET",
                data: parameters,
                dataType: "json",
                success: function(data) {
                    var popupContent;
    
                    if(data[0]) {
                        popupContent = {
                            title: "Ruta " + data[0]["ruta"] + " de evacuación",
                            location: mapPoint,
                            content:
                                "Lugar de inicio: <strong>" + data[0]["lugarInicio"] + "</strong><br/>" +
                                "Lugar de fin: <strong>" + data[0]["lugarFin"] + "</strong><br/><br/>" +
                                "<strong><span class='mapAux' data-type='mapillarySequence' data-sequenceId='" + data[0]["idSecuencia"] + "'>Ver vista de calle</span></strong><br/>" + 
                                "Video frontal: <strong>" + (data[0]["urlFrontal"] ? "<span class='mapAux' data-type='video' data-url='" + data[0]["urlFrontal"] + "'>Ver video</span>" : "No disponible") + "</strong><br/>" +
                                "Video 360°: <strong>" + (data[0]["url360"] ? "<span class='mapAux' data-type='video' data-url='" + data[0]["url360"] + "'>Ver video</span>" : "No disponible") + "</strong><br/>"+
                                "Fecha: <strong>" + fecha + "</strong><br/>"
                        }
                    } else {
                        popupContent = {
                            title: "Ruta de evacuación",
                            location: mapPoint,
                            content: "<span class='mapAux' data-type='mapillarySequence' data-sequenceId='" + sequenceId + "'>Ver vista de calle</span><br/><span>Fecha: "+fecha+"</span><br/>"
                        }
                    }
                    
                    view.popup.open(popupContent);
                    view.popup.collapsed = false; // importante para que funcione en mobil
    
                    window.setTimeout(function(){
                        $(".esri-popup .mapAux").on("click", function() {
                            $("#mapillaryTour").html("");
                            $("#mapillaryTour").append('<span id="closeMapillaryTour" class="close dot"></span>');
                            $('#closeMapillaryTour').click(function(){
                                $("#mapillaryTour").removeClass("active");
                                mly.off(Mapillary.Viewer.nodechanged);
                            });
                            $("#mapillaryTour").addClass("active");
    
                            const type = $(this).attr("data-type");
                            var params = { type: type }
    
                            var layer = map.findLayerById("mapillarySequencePointActive");
                            layer.graphics.removeAll();
    
                            switch(type) {
                                case "video":
                                    const videoUrl = $(this).attr("data-url");
                                    const videoParts = videoUrl.split("/");
                                    params["videoUrl"] = "https://www.youtube.com/embed/" + videoParts[videoParts.length - 1];
    
                                    var templateSource = $("#mapAuxiliary-template").html();
                                    var template = Handlebars.compile(templateSource);
                                    var outputHTML = template(params);
                                    $('#mapillaryTour').html(outputHTML);
                                break;
                                case "mapillarySequence":
                                    const sequenceId = $(this).attr("data-sequenceId");
                                    params["mapillarySequence"] = sequenceId;
    
                                    const clientId = "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx";
                                    const domId = "mapillaryTour";
                                    
                                    var mly = new Mapillary.Viewer(
                                        domId,
                                        clientId,
                                        firstImageKey);
                                    
                                    mly.on(Mapillary.Viewer.nodechanged, function (node) {
                                        view.popup.close();
                                        const point = {
                                            type: "point",
                                            longitude: node.latLon.lon,
                                            latitude: node.latLon.lat,
                                        };
                                          
                                        var pointSymbol = {
                                            type: "simple-marker",
                                            color: "#00ff40",
                                            size: 12,
                                            outline: { // autocasts as new SimpleLineSymbol()
                                                width: 1.5,
                                                color: "white"
                                            }
                                        };
    
                                        const graphic = new Graphic({
                                            geometry: point,
                                            symbol: pointSymbol
                                        });
                                        
                                        var layer = map.findLayerById("mapillarySequencePointActive");
                                        layer.graphics.removeAll();
                                        layer.add(graphic);
    
                                        view.goTo({
                                            target: graphic,
                                            zoom: 18
                                        });
                                    });
                        
                                    window.addEventListener('resize', function() { mly.resize(); });
                                break;
                            }
                        });
                    }, 1000)
                },
                error: function(err) {
    
                }
            });
        });
    }
    
    function loadSequences(map, mapView) {
        require([
            "esri/Graphic",
            "esri/layers/FeatureLayer",
        ], function(
            Graphic,
            FeatureLayer
        ) {
            const endpoint = "/sequences";
            const parameters = {
                per_page: 1000,
                usernames: "cenacom",
                client_id: "b3d6QUR0Q0FqWXVBa3dCZF8taW5ldzo5MDI3OWVkMmQyZDhjMmMx"
            };
    
            $.ajax({
                url: mapillaryBase + endpoint,
                type: "GET",
                data: parameters,
                dataType: "json",
                success: function(data) {
                    let graphics = [];

                    let tmp = map.findLayerById("mapillarySequences");
                    if (tmp)
                        map.remove(tmp);
    
                    data["features"].forEach(function(feature) {
                        const path = feature["geometry"]["coordinates"];
                        const properties = feature["properties"];
                        const fecha_creado = new Date(properties["captured_at"]);
                        if (fecha_creado.getFullYear() != selected_year){
                            return;
                        }
    
                        const polyline = {
                            type: "polyline",
                            paths: path
                        };
    
                        var polylineSymbol = {
                            type: "simple-line",
                            color: [255, 0, 0],
                            width: 16
                        };
    
                        var polylineAtt = properties;
                        graphics.push(new Graphic({
                            geometry: polyline,
                            symbol: polylineSymbol,
                            attributes: polylineAtt
                        }));
                    });
                    console.log(graphics.length);
    
                    const routesFields = [
                        {
                            name: "ObjectID",
                            alias: "ObjectID",
                            type: "oid"
                        },
                        {
                            name: "captured_at",
                            alias: "Fecha de captura",
                            type: "string"
                        },
                        {
                            name: "key",
                            alias: "Id de secuencia",
                            type: "string"
                        },
                        {
                            name: "username",
                            alias: "Usuario",
                            type: "string"
                        },
                        {
                            name: "created_at",
                            alias: "Fecha de creación",
                            type: "string"
                        },
                        {
                            name: "user_key",
                            alias: "Id de Usuario",
                            type: "string"
                        }
                    ];
            
                    var routeTemplate = {
                        title: "Ruta de evacuación",
                        content: [
                            {
                                type: "fields",
                                fieldInfos: [
                                    {
                                        fieldName: "captured_at",
                                        label: "Fecha de captura"
                                    },
                                    {
                                        fieldName: "username",
                                        label: "Usuario"
                                    },
                                    {
                                        fieldName: "key",
                                        label: "Llave de secuencia"
                                    }
                                ]
                            }
                        ]
                    };
            
                    const routeRenderer = {
                        type: "simple",  // autocasts as new SimpleRenderer()
                        symbol: {
                            type: "simple-line",
                            width: 4,
                            color:  [255, 0, 0]
                        }
                    };
    
                    mapillaryRouteLayer = new FeatureLayer({
                        id: "mapillarySequences",
                        fields: routesFields,
                        geometryType: "polyline",
                        popupTemplate: routeTemplate,
                        renderer: routeRenderer,
                        source: graphics,
                    });
    
                    map.layers.add(mapillaryRouteLayer);
                    
                    // let layer = map.findLayerById("mapillarySequences");
                    // layer.source.removeAll();
                    // layer.applyEdits({
                    //     addFeatures: graphics
                    // }).then(function(result) {
                        
                    // }, function(err) { console.log(err) });
    
                    //console.log(layer);
                    loading = false;
                    $('#slider-value').text(selected_year);
                    $('#slider').prop("disabled", false);
                    $('#slidecontainer').attr("disabled", false);
                },
                error: function(error) {
                    console.log("Error al obtener la capa de secuencias");
                    loading = false;
                    $('#slider-value').text(selected_year);
                    $('#slider').prop("disabled", false);
                    $('#slidecontainer').attr("disabled", false);
                }
            });
        });
    }
    
    function getMapillarySequenceImage(domId, clientId, sequenceId) {
        require([
            "https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.js"
        ], function(
            Mapillary
        ) {
            const endpoint = "sequences/";
            const params = {
                client_id: clientId,
            }
            $.ajax({
                url: mapillaryBase + endpoint + sequenceId,
                type: "GET",
                data: parameters,
                dataType: "json",
                success: function(data) {
                    var firstSequence;
                    var mapViewer = new Mapillary.Viewer({
                        domId,
                        clientId,
                    });
                },
                error: function(err) {}
            });
        });
    }
    //loadMap();
});