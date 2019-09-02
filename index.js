 var filterGroup = document.getElementById('filter-group');
 mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';
  // This adds the map to your page
  var map = new mapboxgl.Map({
    container: 'map', // container id specified in the HTML
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-100.546666667, 46.0730555556], // initial map center in [lon, lat]
    zoom: 3
  });

  map.on('load', function() {
    map.addLayer({
      id: 'places',
      type: 'circle',
      source: {
        type: 'geojson',
        data: 'data/map_data_all.geojson' // replace this with the url of your own geojson
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
      'filter': ['==', ['number',['get', 'Year']], 1892]
    });

    // SLIDER
    
    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      map.setFilter('conundrums', ['==', ['number', ['get', 'Year']], year]);

      // update text in the UI
      document.getElementById('active-year').innerText = year;
    });


    // // CLICKABLE POINTS

    // // When a click event occurs on a feature in the places layer, open a popup at the
    // // location of the feature, with description HTML from its properties.
    // map.on('click', 'places', function (e) {
    // var coordinates = e.features[0].geometry.coordinates.slice();
    // var description = e.features[0].properties.description;
     
    // // Ensure that if the map is zoomed out such that multiple
    // // copies of the feature are visible, the popup appears
    // // over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }
     
    // new mapboxgl.Popup()
    // .setLngLat(coordinates)
    // .setHTML(description)
    // .addTo(map);
    // });
     
    // // Change the cursor to a pointer when the mouse is over the places layer.
    // map.on('mouseenter', 'places', function () {
    // map.getCanvas().style.cursor = 'pointer';
    // });
     
    // // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'places', function () {
    // map.getCanvas().style.cursor = '';
    // });

});