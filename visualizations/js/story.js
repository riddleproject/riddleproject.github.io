mapboxgl.accessToken =
  "pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng";


// Initialize filters
var curTypes = [0,1,2,3,4,5,6,7,8,9,10]
var toggles = ['banq', 'bchn', 'bna', 'ean', 'ebof', 'ink', 'lcsoc','lcsup', 'lctea', 'nys', 'ppp']
var startYearFilter = ['>=', ['number', ['get', 'Year']], 0];
var endYearFilter = ['<=', ['number', ['get', 'Year']], 3000];
var typeFilter = ['match', ['get', 'Type'], curTypes, true, false]
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
    bearing: 0,
    center: [-60.88620, 48.62161],
    zoom: 1.47,
    pitch: 0
    filter: [startYearFilter, endYearFilter, typeFilter, onlyMenus];
  },
  "british-riddles": {
    center: [-3.22679, 53.61753],
    bearing: -42.13,
    zoom: 4.77,
    pitch: 54.50
    filter: [startYearFilter, endYearFilter, typeFilter, onlyMenus];
  },
  "ebofs": {
    center: [-3.22679, 53.61753],
    bearing: -42.13,
    zoom: 4.77,
    pitch: 54.50
    filter: [startYearFilter, endYearFilter, ['match', ['get', 'Type'], [4], true, false], onlyMenus];
  },
  "bc-riddles": {
    bearing: 36.27,
    center: [-123.06917, 53.29594],
    zoom: 3.98,
    pitch: 54.50
    filter: [startYearFilter, endYearFilter, typeFilter, onlyMenus];
  },
};

// On every scroll event, check which element is on screen
window.onscroll = function() {
  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      map.setFilter('unclustered-point', ['all', chapterName['filter']])
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
