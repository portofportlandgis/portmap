mapboxgl.accessToken = '';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-122.59311, 45.5930],
    preserveDrawingBuffer: true,
    zoom: 6
});

var printBtn = document.getElementById('mapboxgl-ctrl-print');
var exportView = document.getElementById('export-map');

var printOptions = {
    disclaimer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi.",
    northArrow: '../../north_arrow.svg'
}

printBtn.onclick = function(e) {
    PrintControl.prototype.initialize(map, printOptions)
}

exportView.onclick = function(e) {
    PrintControl.prototype.exportMap();
    e.preventDefault();
}

map.on('load', function () {

    map.addSource('land', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson' });
    map.addLayer({
        "id": "land",
        "type": "fill",
        "source": "land",
        "maxzoom": 18,
        "layout": {
            "visibility": 'visible'
        },
        "paint": {
            'fill-color': '#00ffff',
            'fill-opacity': 0.5
        }
    });

    map.addSource('state-boundaries', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_1_states_provinces_shp.geojson' });
    map.addLayer({
        "id": "state-boundaries",
        "type": "fill",
        "source": "state-boundaries",
        "maxzoom": 18,
        "layout": {
            "visibility": 'visible'
        },
        "paint": {
            'fill-color': '#CEE5C2',
            'fill-opacity': 0.5,
            'fill-outline-color': '#2b2424'
        }
    });


    map.addSource('railroads', { 'type': 'geojson', 'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_railroads_north_america.geojson'});
    map.addLayer({
        "id": "railroads",
        "type": "line",
        "source": "railroads",
        "layout": {
            'visibility': 'visible'
        },
        "paint": {
            "line-color": "#c7515f",
            "line-width": 3,
            "line-dasharray": [4,4],
        }
    });

    map.addSource('airports', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson' });
    map.addLayer({
        "id": "airports",
        "type": "symbol",
        "source": "airports",
        "layout": {
            "visibility": 'visible',
            'icon-image': 'airport-11'

        },
        "paint": {}
    });

    map.addSource('elevation', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_geography_regions_elevation_points.geojson' });
    map.addLayer({
        "id": "elevation-points",
        "type": "circle",
        "source": "elevation",
        "layout": {
            "visibility": 'visible'
        },
        "paint": {
            'circle-color': '#eae00b',
            'circle-opacity': 0.8,
            'circle-stroke-color': '#2b2424',
            'circle-stroke-width': 1
        }
    });
});

var layers =
[
    {
        'name': 'Group',
        'directory': 'Misc',
        'id': 'foo',
        'layerGroup' : [
            {
                'id': 'land',
                'source': 'land',
                'name': 'Land',
                'icon': '../../land.svg'
            },
            {
                'id': 'state-boundaries',
                'source': 'state-boundaries',
                'name': 'State Bounds'
            }
        ]
    },
    {
        'name': 'Railroads',
        'id': 'railroads',
        'source': 'railroads',
        'directory': 'Misc',
    },
    {
        'name': 'Airports',
        'id': 'airports',
        'source': 'airports',
        'directory': 'Transportation'
    },
    {
        'name': 'Elevated Points',
        'id': 'elevation-points',
        'source': 'elevation',
        'directory': 'Transportation',
    },
];

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());
map.addControl(new LayerTree({
    layers: layers
}), 'bottom-left');


