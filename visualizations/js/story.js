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
    data: "./data.geojson",
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
  map.on('click', 'unclustered-point', function (e) {
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
  map.on('mouseenter', 'unclustered-point', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'unclustered-point', function () {
    map.getCanvas().style.cursor = '';
  });
});

var chapters = {
  "introduction": {
    bearing: 0,
    center: [-62.88620, 48.62161],
    zoom: .8,
    pitch: 0,
    filter: null,
  },
  "british-riddles": {
    center: [-3.22679, 53.61753],
    bearing: -42.13,
    zoom: 4.77,
    pitch: 54.50,
    filter: null,
  },
  "ebofs": {
    center: [-3.22679, 53.61753],
    bearing: -20,
    zoom: 4.77,
    pitch: 54.50,
    filter: ['match', ['get', 'Type'], [4], true, false],
  },
  "nys": {
    bearing: -19.56,
    center: [-75.66073, 42.50450],
    zoom: 5.60,
    pitch: 46.50,
    filter: ['match', ['get', 'Type'], [9], true, false],
  },
  "nys2": {
    bearing: -19.56,
    center: [-75.66073, 42.50450],
    zoom: 3,
    pitch: 46.50,
    filter: ['match', ['get', 'Type'], [9], true, false],
  },
  "bc-riddles": {
    bearing: 36.27,
    center: [-123.06917, 53.29594],
    zoom: 3.98,
    pitch: 54.50,
    filter: ['match', ['get', 'Type'], [1], true, false],
  },
  "middle-canada": {
    center: [-111.32966, 53.34845],
    zoom: 4.43,
    pitch: 59.00,
    bearing: -11.66,
    filter: ['match', ['get', 'Type'], [3,10], true, false],
  },
  "quebec": {
    center: [-73.83364, 48.05284],
    zoom: 4.70,
    pitch: 36.00,
    bearing:-12.46,
    filter: ['match', ['get', 'Type'], [0], true, false],
  },
  "overview": {
    bearing: 0,
    center: [-62.88620, 48.62161],
    zoom: .8,
    pitch: 0,
    filter: null,
  },
};

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

  document.getElementById(chapterName).setAttribute("class", "active");
  document.getElementById(activeChapterName).setAttribute("class", "");

  activeChapterName = chapterName;
}

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}
