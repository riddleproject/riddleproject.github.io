mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';


// STARTING POINT
var map = new mapboxgl.Map({
  container: 'map', // container id specified in the HTML
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-90, 50], // initial map center in [lon, lat]
  zoom: 2.2
});

// BUILD MAP
map.on('load', function() {
  // Initialize filters
  var startYear = ['==', ['number', ['get', 'Year']], 1892];
  var filterType = ['!=', ['number', ['get', 'Type']], -1];

  map.addSource("conundrums", {
    type: "geojson",
    data: "data.geojson",
  });

  map.addLayer({
    id: 'places',
    type: 'circle',
    source: 'conundrums',
    paint: {
      'circle-color': [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', 'Type']],
        0, '#747EB3',
        1, '#FF794B',
        2, '#BFCAFF',
        3, '#A5CC85',
        4, '#FFD4A1',
        5, '#58CC70',
        6, '#901499',
        7, '#2D2240',
      ],
      'circle-opacity': 0.8
    },
    'filter': ['all', startYear, filterType]
  });

  var startyear = 1892
  var endyear = 1892
  // SLIDER
  // update start year filter when the slider is dragged
  document.getElementById('start-slider').addEventListener('input', function(e) {
    startyear = parseInt(e.target.value);
    // update the map
    startYear = ['==', ['number', ['get', 'Year']], startyear];
    map.setFilter('places', ['all', startYear, filterType]);
    
    if startyear >= endyear:
      document.getElementById('end-slider').target.value = startyear
    // update text in the UI
    document.getElementById('active-start-year').innerText = startyear;
  });

  // update end year filter when the slider is dragged
  document.getElementById('end-slider').addEventListener('input', function(e) {
    endyear = parseInt(e.target.value);
    // update the map
    var endYear = ['<=', ['number', ['get', 'Year']], endyear];
    startYear = ['>=', ['number', ['get', 'Year']], startyear]
    map.setFilter('places', ['all', startYear, endYear, filterType]);
    
    if endyear <= startyear:
      document.getElementById('start-slider').target.value = endyear
    // update text in the UI
    document.getElementById('active-end-year').innerText = endyear;
  });


  // FILTER BUTTONS
  document.getElementById('filters').addEventListener('change', function(e) {
    var type = e.target.value;
    // update the map filter
    if (type === 'all') {
      filterType = ['!=', ['number', ['get', 'Type']], -1];
    } else if (type === 'banq') {
      filterType= ['match', ['get', 'Type'], [0], true, false];
    } else if (type === 'bchn') {
      filterType = ['match', ['get', 'Type'], [1], true, false];
    } else if (type === 'bna') {
      filterType = ['match', ['get', 'Type'], [2], true, false];
    } else if (type === 'lcsoc') {
      filterType = ['match', ['get', 'Type'], [3], true, false];
    } else if (type === 'lcsup') {
      filterType = ['match', ['get', 'Type'], [4], true, false];
    } else if (type === 'lctea') {
      filterType = ['match', ['get', 'Type'], [5], true, false];
    } else if (type === 'nys') {
      filterType = ['match', ['get', 'Type'], [6], true, false];
    } else if (type === 'ca') {
      filterType = ['match', ['get', 'Type'], [3,4,5], true, false];
    } else {
      console.log('error');
    }
    map.setFilter('places', ['all', startYear, endYear, filterType]);
  });
  

  // SHOW ALL BUTTON
  document.getElementById('checkbox').addEventListener('change', function(e) {
    checked = e.target.checked
    // update the map filter
    if (checked) {
      // disable slider
      document.getElementById('slider').disabled=true;
      document.getElementById('endyear').disabled=true;
      // reset filter
      map.setFilter('places', ['all', filterType]);

    } else {
      // enable slider
      document.getElementById('slider').disabled=false;
      document.getElementById('endyear').disabled=false;

      map.setFilter('places', ['all', startYear, endYear, filterType]);
    }
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
