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
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: 'places',
    type: 'circle',
    source: 'conundrums',
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
      },
    'filter': ['all', startYearFilter, endYearFilter, typeFilter]
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "conundrums",
    filter: ['all', startYearFilter, endYearFilter, typeFilter]
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });
   
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "conundrums",
    filter: ['all', startYearFilter, endYearFilter, typeFilter]
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });

  // inspect a cluster on click
  map.on('click', 'clusters', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    var clusterId = features[0].properties.cluster_id;
    map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err)
        return;
     
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });
     
  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
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
      document.getElementById('inputend').value = startyear;
      endyear = startyear+1;

    };

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('inputstart').value = startyear;
  };

  // method to update all data when the endyear is changed
  function changeEndYear(){
    // update the map
    endYearFilter = ['<=', ['number', ['get', 'Year']], endyear];

    if (startyear >= endyear){
      startYearFilter = ['>=', ['number', ['get', 'Year']], endyear];
      document.getElementById('start-slider').valueAsNumber = endyear;
      document.getElementById('inputstart').value = endyear;
      startyear = endyear-1;
    };

    map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    // update text in the UI
    document.getElementById('inputend').value = endyear;
  };

  // update start year when text is entered
  document.getElementById('inputstart').onkeydown = function(e) {
    if(e.keyCode == 13){
      var n = parseInt(document.getElementById('inputstart').value)
      if (isNaN(n)){
        startyear = startyear
      } else if (n < 1878) {
        startyear = 1878
      } else if (n > 1982) {
        startyear = 1982
      } else{
        startyear = n
      }
      changeStartYear();
      document.getElementById('start-slider').valueAsNumber = startyear;
      document.getElementById('inputstart').value = startyear;
    }
  };

  // update end year when text is entered
  document.getElementById('inputend').onkeydown = function(e) {
    if(e.keyCode == 13){
      var n = parseInt(document.getElementById('inputend').value)
      
      if (isNaN(n)){
        endyear = endyear
      } else if (n < 1878) {
        endyear = 1878
      } else if (n > 1982) {
        endyear = 1982
      } else{
        endyear = n
      }
      changeEndYear();
      document.getElementById('end-slider').valueAsNumber = endyear
      document.getElementById('inputend').value = endyear;
    }
  };

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

  // global states for the time slider
  var ignoreSlider = false;
  var curTypes = [0,1,2,3,4,5,6];
  var checkedAll = true;
  var toggles = ['banq', 'bchn', 'bna', 'lcsoc', 'lcsup', 'lctea', 'nys'];
  
  // FILTER BUTTONS
  document.getElementById('filters').addEventListener('change', function(e) {
    // type indicates the archive which was just checked
    var type = e.target.value;

    // if the all archives button is checked
    if (type === 'all') {
      curTypes = [0,1,2,3,4,5,6];
      checkedAll = true
      // uncheck all the other toggles
      for (toggle of toggles){
        document.getElementById(toggle).checked = false
      }
    
    // if one of the boxes is checked and the all button was previously checked
    } else if (e.target.checked && checkedAll) {
      // set curTypes to only be the value that was checked
      curTypes = [toggles.indexOf(type)];
      // change the state of the show all archives button
      checkedAll = false

    // if one of the individual archives boxes was already checked
    } else if (e.target.checked) {
      // add it to the existing array or archives to show
      curTypes.push(toggles.indexOf(type))
    
    // if an individual archives box is unchecked, and there are multiple individual archives currently checked
    } else if (curTypes.length > 1){
      var index = curTypes.indexOf(toggles.indexOf(type))
      // remove the archive which was unchecked from the array
      curTypes.splice(index, 1)
    
    // if the current archive is the only one which is checked and it is unchecked
    } else {
      // revert to show all filter
      curTypes = [0,1,2,3,4,5,6];
      checkedAll = true
    }
    // assign the proper state to the show all archives checkbox
    document.getElementById('all').disabled = checkedAll
    document.getElementById('all').checked = checkedAll
    typeFilter = ['match', ['get', 'Type'], curTypes, true, false]
    // assign the correct filter depending on whether the time slider should be ignored
    if (ignoreSlider){
      map.setFilter('places', ['all', typeFilter])
    } else{
      map.setFilter('places', ['all', startYearFilter, endYearFilter, typeFilter]);
    }
  });
  

  // SHOW ALL BUTTON
  document.getElementById('checkbox').addEventListener('change', function(e) {
    checked = e.target.checked
    ignoreSlider = checked
    var ids = ['start-slider', 'end-slider', 'inputstart', 'inputend'];
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
