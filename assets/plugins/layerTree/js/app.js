mapboxgl.accessToken = '';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-95.9980, 41.2524],
    zoom: 4
});

map.on('load', function () {

    map.addSource('land', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson' });
    map.addLayer({
        "id": "land",
        "type": "fill",
        "source": "land",
        "layout": {
            "visibility": 'visible'
        },
        "paint": {
            'fill-color': '#a89b97',
            'fill-opacity': 0.8
        }
    });

    map.addSource('state-boundaries', { type: 'geojson', data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_1_states_provinces_shp.geojson' });
    map.addLayer({
        "id": "state-boundaries",
        "type": "fill",
        "source": "state-boundaries",
        "layout": {
            "visibility": 'visible'
        },
        "paint": {
            'fill-color': '#CEE5C2',
            'fill-opacity': 0.8,
            'fill-outline-color': '#2b2424'
        }
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

});

var layers =
[
    {
        'name': 'Land',
        'id': 'land',
        'source': 'land',
        'directory': 'Misc',
    },
    {
        'name': 'State Boundaries',
        'id': 'state-boundaries',
        'source': "state-boundaries",
        'directory': 'Misc',
    },
    {
        'name': 'Elevated Points',
        'id': 'elevation-points',
        'source': 'elevation',
        'directory': 'Misc',
    },
    {
        'name': 'Railroads',
        'id': 'railroads',
        'source': 'railroads',
        'directory': 'Transportation',
    },
    {
        'name': 'Airports',
        'id': 'airports',
        'source': 'airports',
        'directory': 'Transportation',
        'icon': 'icons/airplane.svg'
    },

];

// var basemaps =
// [
//     {
//         'name': 'Streets',
//         'id': 'streets',
//         'source': 'mapbox://styles/mapbox/streets-v9',
//         'directory': 'Base Maps',
//     },
//     {
//         'name': 'Basic',
//         'id': 'basic',
//         'source': 'mapbox://styles/mapbox/basic-v9',
//         'directory': 'Base Maps',
//     },
//     {
//         'name': 'Bright',
//         'id': 'bright',
//         'source': 'mapbox://styles/mapbox/light-v9',
//         'directory': 'Base Maps',
//     }

// ];

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new LayerTree({layers: layers}), 'bottom-left');
