$(document).ready(function () {

    getBaseUrl = function () {

        var getUrl = window.location;
        var host = getUrl.host;
        var protocol = getUrl.protocol;
        var urlParts = getUrl.pathname.split('/');
        var path = "";

        if (host.indexOf("localhost") == -1) path = "/" + urlParts[1]; // + "/" + urlParts[2];

        return protocol + "//" + host + path;
    }

    function getHost() {

        var getUrl = window.location;
        var host = getUrl.host;

        return host;
    }

    refreshJsonSource = function (source) {

        //ignore these properties
        var ignoreProperties = [ ];

        var geoJsonFile = source.split("-")[0];

        var props = new Array();

        var sourcePath = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/";

        var filepath = sourcePath + geoJsonFile + ".geojson";

        //Grab geoJson properties and store in array.
        $.getJSON(filepath, function (data) {

            $.each(data, function (key, val) {

                if (key == "features") {

                    var items = val;
                    var agreement = "";

                    var prop = "";
                    var propval = "";
                    var foo = {};

                    for (i = 0; i < items.length; i++) {

                        var properties = items[i].properties;

                        $.each(properties, (key, value) => {

                            //store label/value/desc tuple in props array
                            if (value !== "" && value != null && !ignoreProperties.includes(key)) {

                                foo = {};
                                prop = "label";
                                propval = value;
                                foo[prop] = propval;

                                prop = "value";
                                propval = key + ":" + value;
                                foo[prop] = propval;

                                prop = "desc";
                                propval = key;
                                foo[prop] = propval;

                                props.push(foo);
                            }

                        });
                    }

                }

            });

            setPropsList(props);

        });

    };

    function setPropsList(props) {

        var props_sort = props.sort(custom_compare);

        var props_unique = new Array();

        //create an empty property object
        var foo = {};
        var prop = "label";
        var propval = "";
        foo[prop] = propval;

        prop = "value";
        propval = ":";
        foo[prop] = propval;

        prop = "desc";
        propval = "";
        foo[prop] = propval;

        var curr_prop = foo;

        for (i = 0; i < props_sort.length; i++) {

            //store unique values in props_unique
            if (props_sort[i].value != curr_prop.value) {

                props_unique.push(props_sort[i]);
                curr_prop = props_sort[i];
            }
        }

        //No results Label var
        var NoResultsLabel = "No Results";

        //bind to search input field
        $("#general_search").autocomplete({

            // autoFocus True prevents mouse click function
            // autoFocus: true,

            open: function (event, ui) {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            },

            source: props_unique,
            delay: 350,
            focus: function (event, ui) {
                $("#general_search").val(ui.item.label);
                $("#property-descr").html("<b>" + ui.item.desc + "</b>");

                return false;

            },
            select: function (event, ui) {
                $("#general_search").val(ui.item.label);
                $("#project-value").val(ui.item.value);
                $("#property-descr").html("<b>" + ui.item.desc + "</b>");

                return false;
            },

            //No Results Response 

            source: function (request, response) {
                var results = $.ui.autocomplete.filter(props_unique, request.term);
                if (!results.length) {
                    results = [NoResultsLabel];
                }

                response(results);
            },

            //End No Results Response


        });  //this requires newer version of jquery-ui.  I found that it was much slower.
        //    .autocomplete("instance")._renderItem = function (ul, item) {

        //    return $( "<li>" )
        //      .append( "<div><b>" + item.desc + "</b><br>" + item.label + "</div>" )
        //      .appendTo( ul );
        //};


    }

    function custom_compare(a, b) {

        return a.value.toString() < b.value.toString() ? -1 : a.value.toString() > b.value.toString() ? 1 : 0;
    }


    //refreshJsonSource("Landbase/Port.easement");


});


function clearFilterLayer() {
    if (typeof map.getLayer('filter_layer') !== "undefined") {
        map.removeLayer("filter_layer");
        map.removeSource("filter_layer");
    }
}

function addJsonLayerFilter(source, property, search_criteria) {

    clearFilterLayer();

    var layer_mapfile = source.split("-")[0];

    var feature_type = source.split("-")[1];

    var sourcePath = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/";

    var filepath = sourcePath + layer_mapfile + ".geojson";


    map.addSource('filter_layer', {
        'type': 'geojson',
        'data': filepath
    });


    var type = "line";
    var paint = {
        "line-color": "cyan",
        "line-width": 3
    }

    var layer_name = layer_mapfile.split(".")[1];

    if (feature_type === "point") {
        type = "circle";
        paint = {
            "circle-color": "cyan",
            "circle-radius": 8
        }
    }

    map.addLayer({
        'id': 'filter_layer',
        'type': type,
        'source': 'filter_layer',
        'layout': {},
        'paint': paint
    });

    //Highlight found element
    //Number types need to be handled     
    if (isNaN(search_criteria)) {
        map.setFilter('filter_layer', ["==", property, search_criteria]);
    } else {
        map.setFilter('filter_layer', ["any", ["==", property, search_criteria], ["==", property, parseFloat(search_criteria)]]);
    }

    $.getJSON(filepath, function (data) {

        var result = L.geoJson(data, {

            filter: function (feature, layer) {

                var property_val = feature.properties[property];

                if (isNaN(feature.properties[property])) {

                    if (property_val === search_criteria) {
                        return true;
                    }
                } else {
                    var float_criteria = parseFloat(search_criteria);
                    if (property_val == float_criteria) {
                        return true;
                    }

                }

            }
        }
       );

        var b = result.getBounds();

        var sw = new mapboxgl.LngLat(b._southWest.lng, b._southWest.lat);
        var ne = new mapboxgl.LngLat(b._northEast.lng, b._northEast.lat);
        var llb = new mapboxgl.LngLatBounds(sw, ne);


        if (b._southWest.lng === b._northEast.lng && b._southWest.lat === b._northEast.lat) { //zoom to point if only one point

            map.flyTo({
                center: sw,
                zoom: 19
            });

        } else {

            map.fitBounds(llb, { padding: 100 });
        }


    });

    function isInt(n) {
        return n % 1 === 0;
    }

}


