$(function() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Expand",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Home",
        "esri/widgets/Search",
        "esri/widgets/Locate"
    ], function(
        Map,
        MapView,
        Expand,
        BasemapGallery,
        Home,
        Search,
        Locate
    ) {
        const map = new Map({ basemap: "hybrid" });

        const view = new MapView({
            container: "crowdMap",
            map: map,
            center: [-98.6264,19.0266],
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

        $("#reporta .tabElement").on("click", function() {
            if($(this).attr("data-tabId") == "1") addReports(view);
        });
    });

    function addReports(mapView) {
        require([
            "esri/Graphic"
        ], function(
            Graphic
        ) {
            $.ajax({
                url: "rutas_fns.php",
                type: "GET",
                data: { allreports: "" },
                dataType: "json",
                success: function (data) {
                    mapView.graphics.removeAll();

                    const markerSymbol = {
                        type: "simple-marker",
                        style: "circle",
                        color: [39, 96, 81],
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };

                    data["reportes"].forEach(function(report) {
                        const point = {
                            type: "point",
                            longitude: parseFloat(report["longitud"]).toFixed(6),
                            latitude: parseFloat(report["latitud"]).toFixed(6)
                        }
            
                        const pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                            popupTemplate: {
                                "title": "Reporte ciudadano",
                                "content": 
                                    report["descripcion"] + "<br/>" +
                                    "Municipio: " + report["municipio"] + "<br/>" +
                                    "Colonia: " + report["colonia"] + "<br/>" +
                                    "Código Postal: " + report["cp"] + "<br/>" +
                                    "Calle y Número: " + report["calle"] + "<br/>" + 
                                    "<a href='" + report["imagenUrl"]  +  "' target='_blank'>Ver imagen</a>"
                            }
                        });
            
                        mapView.graphics.add(pointGraphic);
                    });
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
    }
});
