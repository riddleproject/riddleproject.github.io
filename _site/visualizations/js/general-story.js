mapboxgl.accessToken =
  "pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng";

//order of archives: ['banq', 'bchn', 'bna', 'ean', 'ebof', 'ink', 'lcsoc','lcsup', 'lctea', 'nys', 'ppp'];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-60.88620, 48.62161],
  zoom: 1,
  bearing: 0,
  pitch: 0
});

// BUILD MAP
map.on('load', function() {
  map.addSource("conundrums", {
    type: "geojson",
    data: "/visualizations/data.geojson",
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "conundrums",
    paint: {
      'circle-color': [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', 'Type']],
      0, '#1f77b4',
      1, '#ff7f0e',
      2, '#2ca02c',
      3, '#17becf',
      4, '#9467bd',
      5, '#006411',
      6, '#8c564b',
      7, '#e377c2',
      8, '#7f7f7f',
      9, '#d62728',
      10, '#bcbd22',

      ],
      'circle-opacity': 0.8
    },
  });

  // CLICKABLE POINTS
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  has_popup = false
  map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    popup = new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    has_popup = true
  });
   
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'unclustered-point', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'unclustered-point', function () {
    map.getCanvas().style.cursor = '';
  });
});

// On every scroll event, check which element is on screen
window.onscroll = function() {
  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      map.setFilter('unclustered-point', chapters[chapterName]['filter']);
      break;
    }
  }
};

var activeChapterName = "introduction";
function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;
  map.flyTo(chapters[chapterName]);
  if (has_popup){
    popup.remove();
  }

  document.getElementById(chapterName).setAttribute("class", "active");
  document.getElementById(activeChapterName).setAttribute("class", "");

  activeChapterName = chapterName;
}

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}