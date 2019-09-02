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
      id: 'conundrums',
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
          0, '#2DC4B2',
          1, '#3BB3C3',
          2, '#669EC4',
          3, '#8B88B6',
        ],
        'circle-opacity': 0.8
      },
      'filter': ['==', ['number',['get', 'Year']], 1892]
    });

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      map.setFilter('conundrums', ['==', ['number', ['get', 'Year']], year]);

      // update text in the UI
      document.getElementById('active-year').innerText = year;
    });


  });