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
  var startYearFilter = ['>=', ['number', ['get', 'Year']], 1892];
  var endYearFilter = ['<=', ['number', ['get', 'Year']], 1892];

  var typeFilter = ['!=', ['number', ['get', 'Type']], -1];

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
    'filter': ['all', startYearFilter, endYearFilter, typeFilter]
  });

  var startyear = 1892
  var endyear = 1892
  // SLIDER
  // update start year filter when the slider is dragged
  document.getElementById('start-slider').addEventListener('input', function(e) {
    startyear = parseInt(e.target.value);
    // update the map
    startYearFilter = ['>=', ['number', ['get', 'Year']], startyear];
    
    //if the start year hits the end year, then update the text in the box and the filters
    // now the two filters should be the same. 
    if (startyear >= endyear){
      endYearFilter = ['<=', ['number', ['get', 'Year']], startyear]
      document.getElementById('end-slider').valueAsNumber = startyear;
      document.getElementById('active-end-year').innerText = startyear;
      endyear = startyear+1

    }

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('active-start-year').innerText = startyear;
  });

  // update end year filter when the slider is dragged
  document.getElementById('end-slider').addEventListener('input', function(e) {
    endyear = parseInt(e.target.value);
    // update the map
    endYearFilter = ['<=', ['number', ['get', 'Year']], endyear]

    if (endyear <= startyear){
      startYearFilter = ['>=', ['number', ['get', 'Year']], endyear];
      document.getElementById('start-slider').valueAsNumber = endyear;
      document.getElementById('active-start-year').innerText = startyear;
      startyear = endyear-1


    }

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('active-end-year').innerText = endyear;
  });


  // FILTER BUTTONS
  document.getElementById('filters').addEventListener('change', function(e) {
    var type = e.target.value;
    // update the map filter
    if (type === 'all') {
      typeFilter = ['!=', ['number', ['get', 'Type']], -1];
    } else if (type === 'banq') {
      typeFilter= ['match', ['get', 'Type'], [0], true, false];
    } else if (type === 'bchn') {
      typeFilter = ['match', ['get', 'Type'], [1], true, false];
    } else if (type === 'bna') {
      typeFilter = ['match', ['get', 'Type'], [2], true, false];
    } else if (type === 'lcsoc') {
      typeFilter = ['match', ['get', 'Type'], [3], true, false];
    } else if (type === 'lcsup') {
      typeFilter = ['match', ['get', 'Type'], [4], true, false];
    } else if (type === 'lctea') {
      typeFilter = ['match', ['get', 'Type'], [5], true, false];
    } else if (type === 'nys') {
      typeFilter = ['match', ['get', 'Type'], [6], true, false];
    } else if (type === 'ca') {
      typeFilter = ['match', ['get', 'Type'], [3,4,5], true, false];
    } else {
      console.log('error');
    }
    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
  });
  

  // SHOW ALL BUTTON
  document.getElementById('checkbox').addEventListener('change', function(e) {
    checked = e.target.checked
    // update the map filter
    if (checked) {
      // disable slider
      document.getElementById('start-slider').disabled=true;
      document.getElementById('end-slider').disabled=true;
      // reset filter
      map.setFilter('places', ['all', typeFilter]);

    } else {
      // enable slider
      document.getElementById('start-slider').disabled=false;
      document.getElementById('end-slider').disabled=false;

      map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
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
