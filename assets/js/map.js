mapboxgl.accessToken = '<your access token here>';
var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v9',
    center: [0, 0], 
    zoom: 1, 
    attributionControl: true,
    preserveDrawingBuffer: true, 
});

// navigation controls
map.addControl(new mapboxgl.NavigationControl()); // zoom controls

// scale bar
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 90,
    unit: 'imperial',
    position: 'bottom-right'
}));

// geolocate control
map.addControl(new mapboxgl.GeolocateControl());

//This overides the Bootstrap modal "enforceFocus" to allow user interaction with main map
$.fn.modal.Constructor.prototype.enforceFocus = function () { };

// print function 
var printBtn = document.getElementById('mapboxgl-ctrl-print');
var exportView = document.getElementById('export-map');

var printOptions = {
    disclaimer: "print output disclaimer",
    northArrow: 'assets/plugins/print-export/north_arrow.svg'
}

printBtn.onclick = function (e) {
    PrintControl.prototype.initialize(map, printOptions)
}

exportView.onclick = function (e) {
    PrintControl.prototype.exportMap();
    e.preventDefault();
}


// Layer Search Event Handlers
$('#search_general').on('click', function (e) {

    var criteria = $('#general_search').val();
    var prop = $('#property-descr').text();
    var layer_mapfile = $('#json_layer').val();

    addJsonLayerFilter(layer_mapfile, prop, criteria);

});

$('#clear_general').on('click', function (e) {

    $("#general_search").val("");
    $("#property-descr").html("<br />");
    clearFilterLayer();

});

// Geocoder API
// Geocoder API 
// Geocoder API
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

var addressTool = document.getElementById('addressAppend');
addressTool.appendChild(geocoder.onAdd(map))

map.on('load', function () {
    map.addSource('geocode-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "geocode-point",
        "source": "geocode-point",
        "type": "circle",
        "paint": {
            "circle-radius": 20,
            "circle-color": "dodgerblue",
            'circle-opacity': 0.5,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 3,
        }
    });

    geocoder.on('result', function (ev) {
        map.getSource('geocode-point').setData(ev.result.geometry);
    });

});


// Coordinates Tool
// Coordinates Tool
// Coordinates Tool
map.on('click', function (e) {
    document.getElementById('info').innerHTML =

        JSON.stringify(e.lngLat, function (key, val) {
            return val.toFixed ? Number(val.toFixed(4)) : val;

        });
});


//Layer Tree
//Layer Tree
//Layer Tree

//Load Layers
// Layers that load first will be at the bottom of the root directory within the Layer Tree 

var emptyGJ = {
    'type': 'FeatureCollection',
    'features': []
};

map.on('load', function () {

    //monster layers
    //monster layer sources 
    map.addSource('monster', { type: 'geojson', data: emptyGJ });
    map.addSource('mouth', { type: 'geojson', data: emptyGJ });
    map.addSource('water', { type: 'geojson', data: emptyGJ });
    map.addSource('eyes', { type: 'geojson', data: emptyGJ });

    map.addLayer({
        "id": "monster",
        "type": "fill",
        "source": "monster",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'fill-color': '#b30000',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "mouth",
        "type": "fill",
        "source": "mouth",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'fill-color': 'white',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "water",
        "type": "line",
        "source": "water",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'line-color': '#0099ff',
            'line-opacity': 1.0,
            "line-width": 9,
        },
    });

    map.addLayer({
        "id": "eyes",
        "type": "circle",
        "source": "eyes",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'circle-color': 'white',
            'circle-opacity': 1.0,
            'circle-stroke-color': 'black',
            'circle-stroke-width': 3,
            'circle-stroke-opacity': 1.0,
        }
    });


    //cultural layers
    //cultural layers
    map.addSource('country', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "country",
        "type": "fill",
        "source": "country",
        "layout": {
           //"visibility": 'none'
        },
        "paint": {
            'fill-color': '#595959',
            'fill-opacity': .5,
            'fill-outline-color': '#333333',
        }
    });


    map.addSource('populated', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "populated",
        "type": "circle",
        "source": "populated",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'circle-color': 'white',
            'circle-opacity': 1.0,
            'circle-stroke-color': '#ff8c1a',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 1.0,
        }
    });

    //physical layers
    //physical layers
    map.addSource('ocean', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "ocean",
        "type": "fill",
        "source": "ocean",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'fill-color': '#00334d',
            'fill-opacity': 0.5,
            'fill-outline-color': '#00111a',
        }
    });

    map.addSource('river', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "river",
        "type": "line",
        "source": "river",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'line-color': '#0099cc',
            'line-opacity': .8,
            "line-width": 4,
        },
    });



    //Layer Info function
    //Layer Info function
    //Layer Info function
    //Layer Info function
    map.on('click', function (e) {

        document.getElementById("layer-attribute").innerHTML = "";

    });

    map.on('click', function (e) {

        var popup = new mapboxgl.Popup();
        var feature;
        var append = document.getElementById('layer-attribute');

        //Cultural - Layer Info
        //Cultural - Layer Info

        if (map.queryRenderedFeatures(e.point, { layers: ['populated'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['populated'] })[0];

            append.innerHTML +=
                  '<h5>Populated Places</h5>' +
                  '<hr>' +
                  '<b>City: </b>' + feature.properties.name +
                  '<hr>' +
				  '<b>Country: </b>' + feature.properties.sov0name +
				  '<hr>' 
        }

        if (map.queryRenderedFeatures(e.point, { layers: ['country'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['country'] })[0];

            append.innerHTML +=
              '<h5>Country</h5>' +
              '<hr>' +
              '<b>Port Name </b>' + feature.properties.admin +
              '<hr>' +
              '<b>Code: </b>' + feature.properties.adm0_a3 +
              '<hr>' 
        }

        //Monster - Layer Info
        //Monster - Layer Info
        if (map.queryRenderedFeatures(e.point, { layers: ['monster'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['monster'] })[0];

            append.innerHTML +=
                  '<h5>Monster Info</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + 'Mr. Claw'+
                  '<hr>' +
                  '<b>Place of Birth: </b>' + 'Atlantic Ocean' +
			      '<hr>' +
                  '<b>Likes: </b>' + 'Birthday Parties' +
			      '<hr>' +
                  '<b>Dislikes: </b>' + 'Seafood Festivals' +
			      '<hr>'
        }

 
        //Physical - Layer Info
        //Physical  - Layer Info
        if (map.queryRenderedFeatures(e.point, { layers: ['ocean'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['ocean'] })[0];

            append.innerHTML +=
                  '<h5>Oceans</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + feature.properties.name +
                  '<hr>'
        }

        if (map.queryRenderedFeatures(e.point, { layers: ['river'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['river'] })[0];

            append.innerHTML +=
                  '<h5>Major Rivers</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + feature.properties.name +
                  '<hr>' 
        }
    });

    //cursor = pointer on hover configuration 
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['ocean', 'river', 'country', 'populated', 'monster']
        });
        map.getCanvas().style.cursor = (features.length) ? 'default' : '';
    });


    //Highlight Features Function
    //Highlight Features Function
    //Highlight Features Function
    //Highlight Features Function

    // Highligt Environmental
    map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["populated"] });

        if (map.getLayer("populated_hl")) {
            map.removeLayer("populated_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "populated_hl",
                "type": "circle",
                "source": "populated",
                "layout": {},
                "paint": {
                    "circle-color": "cyan",
                    "circle-radius": 7
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });

    map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["country"] });

        if (map.getLayer("country_hl")) {
            map.removeLayer("country_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "country_hl",
                "type": "line",
                "source": "country",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "sovereignt", features[0].properties.sovereignt],
            });
        }
    });

   
    //Highlight - Monster
    map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["monster"] });

        if (map.getLayer("monster_hl")) {
            map.removeLayer("monster_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "monster_hl",
                "type": "line",
                "source": "monster",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "Id", features[0].properties.Id],
            });
        }
    });

 
    //Highlight - Physical
    map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["river"] });

        if (map.getLayer("river_hl")) {
            map.removeLayer("river_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "river_hl",
                "type": "line",
                "source": "river",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 4
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });

   
    map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["ocean"] });

        if (map.getLayer("ocean_hl")) {
            map.removeLayer("ocean_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "ocean_hl",
                "type": "line",
                "source": "ocean",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });
});


// Directory Options 
// Directory Options 
// Directory Options - open or closed by defualt (true/false)

var directoryOptions =
[
    {
        'name': 'Monster',
        'open': true
    },
    {
        'name': 'Cultural',
        'open': true
    },
    {
        'name': 'Physical',
        'open': true
    },

];


// organize layers in the layer tree

var layers =

[
 
    // Monster LAYER TREE CONFIG
    // Monster LAYER TREE CONFIG
    {
        'name': 'Monster',
        'id': 'monster_group',
        'hideLabel': ['mouth', 'water', 'eyes'],
        'icon': 'assets/images/layer-stack-15.svg',
        'layerGroup': [
            {
                'id': 'monster',
                'source': 'monster',
                'name': 'Mr. Claw',
                'path': 'assets/json/monster.json',
            },
            {
                'id': 'mouth',
                'source': 'mouth',
                'name': 'Mouth',
                'path': 'assets/json/mouth.json',
            },
            {
                'id': 'water',
                'source': 'water',
                'name': 'Water',
                'path': 'assets/json/water.json',
            },
            {
                'id': 'eyes',
                'source': 'eyes',
                'name': 'Eyes',
                'path': 'assets/json/eyes.json',
            },

        ],
        'directory': 'Monster'
    },


     // Cultural LAYER TREE CONFIG
     // Cultural LAYER TREE CONFIG

    {
        'name': 'Populated Places',
        'id': 'populated',
        'source': "populated",
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson',
        'directory': 'Cultural',
    },
    {
        'name': 'Countries',
        'id': 'country',
        'source': 'country',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_map_units.geojson',
        'directory': 'Cultural',
    },


    // Physical LAYER TREE CONFIG
    // Physical LAYER TREE CONFIG

    {
        'name': 'Major Rivers',
        'id': 'river',
        'source': 'river',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_rivers_lake_centerlines.geojson',
        'directory': 'Physical',
    },
    {
        'name': 'Oceans',
        'id': 'ocean',
        'source': 'ocean',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_geography_marine_polys.geojson',
        'directory': 'Physical',
    },
   
];


var layerList = new LayerTree({ layers: layers, directoryOptions: directoryOptions, onClickLoad: true });

var layerTool = document.getElementById('menu');
layerTool.appendChild(layerList.onAdd(map))


//BOOKMARKS
//BOOKMARKS
//BOOKMARKS

document.getElementById('icelandBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [-18.7457, 65.0662],
        zoom: 5,
    });
});

document.getElementById('safricaBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [23.9417, -29.5353],
        zoom: 5,
    });
});

document.getElementById('japanBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [138.6098, 36.3223],
        zoom: 4,
    });
});

document.getElementById('australiaBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [134.1673, -25.6855],
        zoom: 3

    });
});



//TEXT TOOL
//TEXT TOOL
//TEXT TOOL

var MAP_DIV = map.getCanvasContainer();
var EDIT_NODE = document.getElementById('editTextTool');
var LABEL_NODE = document.getElementById('textTool');

//set user defined sizes/colors in palette
var TEXT_SIZES = [24, 20, 16, 12];
var TEXT_COLORS = ['#000', '#c12123', '#ee4498', '#00924d', '#00afde', '#ccbe00'];

//char count limit
var CHAR_LIMIT = 20;

//drag status
var isDragging = false;


function activateTool(el) {
    if (el.getAttribute('active') === 'true') {
        el.setAttribute('active', false);

        if (el.isEqualNode(EDIT_NODE)) {
            var activeInput = document.querySelector('.label-marker.active span');
            if (activeInput) {
                activeInput.focus();
                activeInput.blur();
            }
        }
        MAP_DIV.style.cursor = '';

    } else {
        el.isEqualNode(EDIT_NODE) ? LABEL_NODE.setAttribute('active', false) : EDIT_NODE.setAttribute('active', false);
        el.setAttribute('active', true);

        MAP_DIV.style.cursor = 'crosshair';
    }
}

//generate unique layer ids for text-labels
function generateTextID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//convert marker DOM elements to symbol layers
function markerToSymbol(e, elm) {
    if (isDragging) return;

    MAP_DIV.style.cursor = '';

    var that = this instanceof Element ? this : elm;
    var childSpan = document.querySelector('.marker-text-child');

    if (childSpan) var parent = childSpan.parentNode;

    if (that.innerText !== '' && that.innerText.length > 0) {
        parent ? parent.classList.remove('active') : that.classList.remove('active');

        var fontSize = that.style['font-size'] === '' ? TEXT_SIZES[1] : parseInt(that.style['font-size'].split('px')[0]); //textSize[1] is default
        var fontColor = that.style.color === '' ? '#000' : that.style.color;
        var coords = [that.getAttribute('lng'), that.getAttribute('lat')];

        var labelGJ = {
            "type": "FeatureCollection",
            "features": [
              {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                      "type": "Point",
                      "coordinates": coords
                  }
              }
            ]
        };

        var id = generateTextID();
        var lyrID = id + '-custom-text-label';

        map.addSource(id, { type: 'geojson', data: labelGJ });

        map.addLayer({
            "id": lyrID,
            "type": "symbol",
            "source": id,
            "layout": {
                "text-field": that.innerText,
                "text-size": fontSize,
                "symbol-placement": "point",
                "text-keep-upright": true
            },
            "paint": {
                "text-color": fontColor,
                "text-halo-color": '#FFF',
                "text-halo-width": 2,
            },
        });

        //removes text-input marker after clicking off
        LABEL_NODE.setAttribute('active', false);

        that.removeEventListener('blur', markerToSymbol);
    }

    parent ? parent.remove() : that.remove();
}

//label text limit/prevent event keys
function inputText(e) {

    console.log(e.key, e.keyCode)

    //arrow keys
    if ([32, 37, 38, 39, 40, 8].indexOf(e.keyCode) > -1) {
        e.stopPropagation();
        //enter key

    } else if (e.keyCode === 13 && this.innerText.length <= CHAR_LIMIT) {
        this.blur();

        MAP_DIV.style.cursor = '';

        e.preventDefault();
        //limit
    } else if (this.innerText.length >= CHAR_LIMIT && e.keyCode !== 8) {
        e.preventDefault();
        alert(keycode);
    }
}


//pasting text into requires additional handling
//for text limit
function handlePaste(e) {
    var clipboardData, pastedData;

    e.stopImmediatePropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('text/plain').slice(0, CHAR_LIMIT);

    this.innerText = pastedData;
}

function createMarker(e, el) {

    new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(map);
}

//populates edit palette with user defined colors/sizes
function populatePalette() {
    var palette = document.getElementById('customTextPalette');
    var textSizeDiv = document.getElementById('customTextSize');
    var textColorDiv = document.getElementById('customTextColor');

    for (var s = 0; s < TEXT_SIZES.length; s++) {
        var sElm = document.createElement('div');
        sElm.className = 'font-size-change';
        sElm.id = 'font-' + TEXT_SIZES[s];
        sElm.innerText = 'T'; //change to whatever font/image
        sElm.style['font-size'] = TEXT_SIZES[s] + 'px';
        sElm.addEventListener('mousedown', changeFontStyle);

        textSizeDiv.appendChild(sElm);
    };

    for (var c = 0; c < TEXT_COLORS.length; c++) {
        var cElm = document.createElement('div');
        cElm.className = 'font-color-change';
        cElm.id = 'font-' + TEXT_COLORS[c];
        cElm.style['background-color'] = TEXT_COLORS[c];
        cElm.addEventListener('mousedown', changeFontStyle);

        textColorDiv.appendChild(cElm);
    };
}

//update marker font styles
function changeFontStyle(e) {
    e.preventDefault();
    e.stopPropagation();

    var labelDiv = document.querySelector('.label-marker');
    var childSpan = document.querySelector('.marker-text-child');

    var mark = childSpan ? childSpan : labelDiv;

    if (mark) {
        labelDiv.classList.add('active');
        if (e.target.classList.contains('font-size-change')) {
            mark.style['font-size'] = e.target.style['font-size'];
        } else if (e.target.classList.contains('font-color-change')) {
            mark.style.color = e.target.style['background-color'];
        }

        mark.focus();
    }

    MAP_DIV.style.cursor = 'text';
}

//marker move functionality - modified GL example
//https://www.mapbox.com/mapbox-gl-js/example/drag-a-point/
function beginDrag(e) {
    e.stopImmediatePropagation();

    map.dragPan.disable();

    isDragging = true;

    MAP_DIV.style.cursor = 'cursor:-moz-grab;cursor:-webkit-grab;cursor:grab';

    map.on('mousemove', onDrag);
    map.on('touchmove', onDrag);

    map.once('mouseup', stopDrag);
    map.once('touchend', stopDrag);
}

function onDrag(e) {
    if (!isDragging) return;

    var label = document.querySelector('.label-marker');

    MAP_DIV.style.cursor = 'cursor:-moz-grabbing;cursor:-webkit-grabbing;cursor:grabbing';

    map.dragPan.disable();

    createMarker(e, label);
}

function stopDrag(e) {
    if (!isDragging) return;

    var textSpan = document.querySelector('.marker-text-child');

    textSpan.setAttribute('lng', e.lngLat.lng);
    textSpan.setAttribute('lat', e.lngLat.lat);

    isDragging = false;

    textSpan.parentNode.style.cursor = '';
    MAP_DIV.style.cursor = '';

    map.dragPan.enable();

    setTimeout(function () {
        markerToSymbol(e, textSpan);
    }, 50)

    // Unbind move events
    map.off('mousemove', onDrag);
    map.off('touchmove', onDrag);
}

function addEditLabels(e) {
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();

    if (isDragging) return;

    //create a large bounding box for capture
    var clickBBox = [[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]];

    //adding text
    if (LABEL_NODE.getAttribute('active') === 'true') {

        var el = document.createElement('div');
        el.className = 'label-marker';

        el.setAttribute('contenteditable', 'true');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
        el.setAttribute('lng', e.lngLat.lng);
        el.setAttribute('lat', e.lngLat.lat);
        el.style['font-size'] = TEXT_SIZES[1] + 'px';  //defaulting to second size

        map.marker = createMarker(e, el);

        el.addEventListener("blur", markerToSymbol);
        el.addEventListener("keydown", inputText);
        el.addEventListener("paste", handlePaste);

        el.focus();

        //editting text
    } else if (EDIT_NODE.getAttribute('active') === 'true') {

        //filters layers for custom text labels
        function isCustomText(item) {
            return item.layer.id.indexOf('-custom-text-label') > -1
        }

        var features = map.queryRenderedFeatures(clickBBox);
        var activeInput = document.querySelector('.marker-text-child');

        if (features.length) {
            var customLabels = features.filter(isCustomText);

            if (customLabels.length) {
                //only returning the first feature
                //user is going to have to zoom in further
                var feature = customLabels[0].layer;

                var lyrID = feature.id;
                var sourceID = feature.source;
                var text = feature.layout['text-field'];
                var featureFontSize = feature.layout['text-size'] + 'px';
                var featureFontColor = feature.paint['text-color'];

                var mapSource = map.getSource(sourceID);
                var coords = mapSource._data.features[0].geometry.coordinates;

                var container = document.createElement('div');
                container.className = 'label-marker label-container active';

                var el = document.createElement('span');
                el.className = 'marker-text-child';
                el.innerText = text;

                el.style['font-size'] = featureFontSize;
                el.style.color = featureFontColor;

                el.setAttribute('lng', coords[0]);
                el.setAttribute('lat', coords[1]);
                el.setAttribute('contenteditable', 'true');
                el.setAttribute('autocorrect', 'off');
                el.setAttribute('spellcheck', 'false');

                //drag icon - using FontAwesome as an example
                var dragUI = document.createElement('i');
                dragUI.className = 'fa fa-arrows-alt fa-lg drag-icon';
                dragUI.setAttribute('aria-hidden', true);

                container.appendChild(dragUI);
                container.appendChild(el);

                map.removeSource(sourceID);
                map.removeLayer(lyrID);

                createMarker(e, container);

                dragUI.addEventListener("mousedown", beginDrag);
                dragUI.addEventListener("touchstart", beginDrag);

                el.addEventListener("blur", markerToSymbol);
                el.addEventListener("keydown", inputText);
                el.addEventListener("paste", handlePaste);

            } else if (activeInput) {
                activeInput.isEqualNode(e.originalEvent.target) ? activeInput.focus() : markerToSymbol(e, activeInput);
            }
        }
    }
}

//fire function to populate text/color custom pallete
populatePalette();

map.on('click', addEditLabels);



//Draw Tools function
//Draw Tools function
//Draw Tools function 
var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        point: true,
        line_string: true,
        trash: true,
    }
});

var drawTool = document.getElementById('drawAppend');
drawTool.appendChild(draw.onAdd(map))



//// Turf Area Calc

var calcButton = document.getElementById('calculate');
calcButton.onclick = function () {

    //FEET
    if (document.getElementById('feet').checked) {

        var data = draw.getSelected();
        if (data.features.length > 0) {
            var area = turf.area(data) / 0.09290304;
            // restrict to 2 decimal points
            var rounded_area = Math.round(area * 100) / 100;
            var answer = document.getElementById('calculated-area');
            answer.innerHTML = '<p>' + rounded_area + ' ft<sup>2</sup></p>';
        } if (data.features.length > 0) {
            var length = turf.lineDistance(data, 'meters') / 0.3048;
            // restrict to 2 decimal points
            var rounded_length = Math.round(length * 100) / 100;
            var answer = document.getElementById('calculated-length');
            answer.innerHTML = '<p>' + rounded_length + ' ft</p>';
        } else {
            alert("Draw or Select a Line or Polygon before calculating!");
        }


        //METER
    } else if (document.getElementById('meter').checked) {

        var data = draw.getSelected();
        if (data.features.length > 0) {
            var area = turf.area(data);
            // restrict to 2 decimal points
            var rounded_area = Math.round(area * 100) / 100;
            var answer = document.getElementById('calculated-area');
            answer.innerHTML = '<p>' + rounded_area + ' m<sup>2</sup></p>';
        } if (data.features.length > 0) {
            var length = turf.lineDistance(data, 'meters');
            // restrict to 2 decimal points
            var rounded_length = Math.round(length * 100) / 100;
            var answer = document.getElementById('calculated-length');
            answer.innerHTML = '<p>' + rounded_length + ' m</p>';
        } else {
            alert("Draw or Select a Line or Polygon before calculating!");
        }

        //MILE
    } else if (document.getElementById('mile').checked) {

        var data = draw.getSelected();
        if (data.features.length > 0) {
            var area = turf.area(data) / 2589988.11;
            // restrict to 4 decimal points
            var rounded_area = Math.round(area * 10000) / 10000;
            var answer = document.getElementById('calculated-area');
            answer.innerHTML = '<p>' + rounded_area + ' mi<sup>2</sup></p>';
        } if (data.features.length > 0) {
            var length = turf.lineDistance(data, 'meters') / 1609.344;
            // restrict  to 2 decimal points
            var rounded_length = Math.round(length * 100) / 100;
            var answer = document.getElementById('calculated-length');
            answer.innerHTML = '<p>' + rounded_length + ' mi</p>';
        } else {
            alert("Draw or Select a Line or Polygon before calculating!");
        }

        //KILOMETER
    } else if (document.getElementById('kilometer').checked) {

        var data = draw.getSelected();
        if (data.features.length > 0) {
            var area = turf.area(data) / 1000000;
            // restrict to 4 decimal points
            var rounded_area = Math.round(area * 10000) / 10000;
            var answer = document.getElementById('calculated-area');
            answer.innerHTML = '<p>' + rounded_area + ' km<sup>2</sup></p>';
        } if (data.features.length > 0) {
            var length = turf.lineDistance(data, 'meters') / 1000;
            // restrict to 2 decimal points
            var rounded_length = Math.round(length * 100) / 100;
            var answer = document.getElementById('calculated-length');
            answer.innerHTML = '<p>' + rounded_length + ' km</p>';
        } else {
            alert("Draw or Select a Line or Polygon before calculating!");
        }

        //ACRE
    } else if (document.getElementById('acre').checked) {

        var data = draw.getSelected();
        if (data.features.length > 0) {
            var area = turf.area(data) / 4046.85642;
            // restrict  to 4 decimal points
            var rounded_area = Math.round(area * 10000) / 10000;
            var answer = document.getElementById('calculated-area');
            answer.innerHTML = '<p>' + rounded_area + ' acres</p>';
        }
        if (data.features.length > 0) {
            var length = turf.lineDistance(data, 'meters') / 0.3048;
            // restrict to 2 decimal points
            var rounded_length = Math.round(length * 100) / 100;
            var answer = document.getElementById('calculated-length');
            answer.innerHTML = '<p>' + rounded_length + ' ft</p>';
        } else {
            alert("Draw or Select a Line or Polygon before calculating!");
        }

    }
};




