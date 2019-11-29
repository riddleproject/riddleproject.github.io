mapboxgl.accessToken =
  "pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng";


// Initialize filters
var startYearFilter = ['>=', ['number', ['get', 'Year']], 1892];
var endYearFilter = ['<=', ['number', ['get', 'Year']], 1892];
var typeFilter = ['!=', ['number', ['get', 'Type']], -1];
var onlyMenus = ['!=', ['number', ['get', 'has_menu']], -1];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-0.15591514, 51.51830379],
  zoom: 15.5,
  bearing: 27,
  pitch: 45
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
    filter: ['all', startYearFilter, endYearFilter, typeFilter],
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
});

var chapters = {
  "introduction": {
    bearing: 27,
    center: [-0.15591514, 51.51830379],
    zoom: 15.5,
    pitch: 20
  },
  "british-riddles": {
    duration: 6000,
    center: [-0.07571203, 51.51424049],
    bearing: 150,
    zoom: 15,
    pitch: 0
  },
  "bc-riddles": {
    bearing: 90,
    center: [-0.08533793, 51.50438536],
    zoom: 13,
    speed: 0.6,
    pitch: 40
  },
};

// On every scroll event, check which element is on screen
window.onscroll = function() {
  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      break;
    }
  }
};

var activeChapterName = "baker";
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
