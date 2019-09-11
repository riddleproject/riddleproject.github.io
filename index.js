mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';


// STARTING POINT
var map = new mapboxgl.Map({
  container: 'map', // container id specified in the HTML
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-100.546666667, 46.0730555556], // initial map center in [lon, lat]
  zoom: 3
});


// BUILD MAP
map.on('load', function() {
  var filterYear = ['==', ['number', ['get', 'Year']], 1892];
  var filterType = ['!=', ['number', ['get', 'Type']], -1];

  map.addLayer({
    id: 'places',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'data.geojson'
    },
    paint: {
      'circle-color': [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', 'Type']],
        0, '#747EB3',
        1, '#FF794B',
        2, '#BFCAFF',
        3, '#A5CC85',
      ],
      'circle-opacity': 0.8
    },
    'filter': ['all', filterYear, filterType]
  });


  // SLIDER
  // update hour filter when the slider is dragged
  document.getElementById('slider').addEventListener('input', function(e) {
    var year = parseInt(e.target.value);
    // update the map
    filterYear = ['==', ['number', ['get', 'Year']], year];
    map.setFilter('places', ['all', filterYear, filterType]);

    // update text in the UI
    document.getElementById('active-year').innerText = year;
  });



  // FILTER BUTTONS
  document.getElementById('filters').addEventListener('change', function(e) {
    var type = e.target.value;
    // update the map filter
    if (type === 'all') {
      filterType = ['!=', ['number', ['get', 'Type']], -1];
    } else if (type === 'loc') {
      filterType= ['match', ['get', 'Type'], [0], true, false];
    } else if (type === 'supper') {
      filterType = ['match', ['get', 'Type'], [1], true, false];
    } else if (type === 'tea') {
      filterType = ['match', ['get', 'Type'], [2], true, false];
    } else if (type === 'social') {
      filterType = ['match', ['get', 'Type'], [3], true, false];
    } else if (type === 'showall') {
      filterType = ['match', ['get', 'Type'], [0, 1, 2, 3], true, false];
      filterYear = ['!=', ['number', ['get', 'Year']], 0];
    } else {
      console.log('error');
    }
    map.setFilter('places', ['all', filterYear, filterType]);
  });

  document.getElementByID('showallbox').addEventListener('everything', function(e){
    var on = e.target.value;
    if (value === 'showall') {
      filterType = ['match', ['get', 'Type'], [0, 1, 2, 3], true, false];
      filterYear = ['!=', ['number', ['get', 'Year']], 0];
    }
    map.setFilter('places', ['all', filterYear, filterType])
  });



  // CLICKABLE POINTS
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
  });
   
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'places', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places', function () {
    map.getCanvas().style.cursor = '';
  });

});
