mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';

// only accept input to the text boxes if enter is pressed
function checkEnter(e){ //e is event object passed from function invocation
  var characterCode; //literal character code will be stored in this variable

  if(e && e.which){ //if which property of event object is supported (NN4)
    e = e;
    characterCode = e.which; //character code is contained in NN4's which property
  } else {
    e = event;
    characterCode = e.keyCode; //character code is contained in IE's keyCode property
  };

  if(characterCode == 13){ //if generated character code is equal to ascii 13 (if enter key)
    return false;
  } else {
    return true;
  };
};

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
  // method to update all data when the start year is changed
  function changeStartYear(){
    // update the map
    startYearFilter = ['>=', ['number', ['get', 'Year']], startyear];
    
    //if the start year hits the end year, then update the text in the box and the filters
    // now the two filters should be the same. 
    if (startyear >= endyear){
      endYearFilter = ['<=', ['number', ['get', 'Year']], startyear]
      document.getElementById('end-slider').valueAsNumber = startyear;
      document.getElementById('input-end').value = startyear;
      endyear = startyear+1;

    };

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('input-start').value = startyear;
  };

  // method to update all data when the endyear is changed
  function changeEndYear(){
    // update the map
    endYearFilter = ['<=', ['number', ['get', 'Year']], endyear];

    if (startyear >= endyear){
      startYearFilter = ['>=', ['number', ['get', 'Year']], endyear];
      document.getElementById('start-slider').valueAsNumber = endyear;
      document.getElementById('input-start').value = endyear;
      startyear = endyear-1;
    };

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('input-end').value = endyear;
  };

  // update start year when text is entered
  // document.getElementById('input-start').addEventListener('input', function(e) {
  //   startyear = parseInt(e.value);
  //   changeStartYear();
  // });

  // // update end year when text is entered
  // document.getElementById('input-end').addEventListener('input', function(e) {
  //   endyear = parseInt(e.value);
  //   changeEndYear();
  // });

  // update start year filter when the slider is dragged
  document.getElementById('start-slider').addEventListener('input', function(e) {
    startyear = parseInt(e.target.value);
    changeStartYear();
  });

  // update end year filter when the slider is dragged
  document.getElementById('end-slider').addEventListener('input', function(e) {
    endyear = parseInt(e.target.value);
    changeEndYear();
  });

  var curTypes = [0,1,2,3,4,5,6]
  var checkedAll = true
  // FILTER BUTTONS
  document.getElementById('filters').addEventListener('change', function(e) {
    var type = e.target.value;
    var toggles = ['banq', 'bchn', 'bna', 'lcsoc', 'lcsup', 'lctea', 'nys']

    // update the map filter
    // if the all archives button is checked
    if (type === 'all') {
      curTypes = [0,1,2,3,4,5,6];
      checkedAll = true

      for (toggle of toggles){
        document.getElementById(toggle).checked = false
      }
    // if any one of the other boxes is checked
    } else {
      // if one of the boxes is checked and the all button was previously checked
      if (e.target.checked && checkedAll) {
        // set curTypes to only be the value that was checked
        curTypes = [toggles.indexOf(type)];
        document.getElementById('all').checked = false
        checkedAll = false
      // if one of the boxes is checked and another is already checked
      } else if (e.target.checked && !checkedAll) {
        curTypes.push(toggles.indexOf(type))
      // if one of the boxes is unchecked
      } else {
        if (curTypes.length > 1) {
          curTypes.pop(toggles.indexOf(type))
        } else {
          document.getElementById('all').checked = true
          curTypes = [0,1,2,3,4,5,6];
          checkedAll = true
        }
      }
    }
    document.getElementById('all').disabled = checkedAll
    console.log(curTypes)
    typeFilter = ['match', ['get', 'Type'], curTypes, true, false]

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
  });
  

  // SHOW ALL BUTTON
  document.getElementById('checkbox').addEventListener('change', function(e) {
    checked = e.target.checked
    var ids = ['start-slider', 'end-slider', 'input-start', 'input-end'];
    var id;
    // update the map filter
    if (checked) {
      // disable slider
      for (id of ids) {
        document.getElementById(id).disabled = true;
      }
      // reset filter
      map.setFilter('places', ['all', typeFilter]);

    } else {
      // enable slider
      for (id of ids) {
        document.getElementById(id).disabled = false;
      }
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
