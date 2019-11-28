<!DOCTYPE html>
<html>
<link rel="shortcut icon" type="image/icon" href="favis/favicon.ico"/>

<head>
  <meta charset='utf-8' />
  <title>Interactive Map | The Riddles Project</title>
  <meta name='robots' content='noindex, nofollow'>
  <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
  <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.js'></script>
  <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css' rel='stylesheet' />
  
  <link rel = "stylesheet"
   type = "text/css"
   href = "styles/filters.css" />

</head>

<body >
  <div id='map'></div>
  <nav id='filter-group' class='filter-group'></nav>
  <div id = 'items'>
    <div id='console'>
      <h1>Riddling Events, 1733-1971</h1>
      <p>Click on a point to learn more about the event that occurred there.</p>

      <h2>Filter by date</h2>
      <!-- Slider bar -->
      <div class='session' id='sliderbar' autocomplete="off">
         Start year: <label id='active-start-year'> <input id='inputstart' type="text" name="textStartYear" value="1892" class='text' autocomplete="off"> </label>
        <input  id='start-slider' class='row' type='range' min='1733' max='1971' step='1' value='1892' autocomplete="off" />
      </div>
      <!-- Slider bar -->
      <div class='session' id='sliderbar2'>
        End year: <label id='active-end-year'> <input id='inputend' type="text" name="textEndYear" value="1892" class='text' autocomplete="off"> </label>
        <input id='end-slider' class='row' type='range' min='1733' max='1971' step='1' value='1892' autocomplete="off"  />
      </div>
      
      <!-- Show all checkbox -->
      <div class='session' >
        <div class='row' id='checkbox'>  
          <input id = 'disableSlider' type="checkbox" name="showall" value="box" autocomplete="off">
          <label for='disableSlider'> Ignore time slider</label><br/> 
        </div>
      </div>

      <!-- Only show rows with menus -->
      <div class='session' >
        <div class='row' id='menuShower'>  
          <input id = 'showMenus' type="checkbox" name="showall" value="box" autocomplete="off">
          <label for='showMenus'> Only show riddles with menus</label><br/> 
        </div>
      </div>

      <!-- Disable filtering-->
      <div class='session'>
        <h2>Filter by archive</h2>
        <div class='row' id='archive-filters'>
          <input autocomplete="off" id='all' type='checkbox' name='toggle' value='all' checked disabled='disabled'>
          <label for='all'> All archives</label><br/> 
          
          <input id='banq' type='checkbox' name='toggle' value='banq' autocomplete="off">
          <label id = 'banqcolor' for='banq' style='color:#1f77b4'> Bibliothèque et Archives nationales du Québec</label><br/> 
          
          <input id='bchn' type='checkbox' name='toggle' value='bchn' autocomplete="off">
          <label id = 'bchncolor' for='bchn' style='color:#ff7f0e'> British Columbia Historical Newspapers</label><br/> 

          <input id='bna' type='checkbox' name='toggle' value='bna' autocomplete="off">
          <label id = 'bnacolor' for='bna' style='color:#2ca02c'> British Newspaper Archives</label><br/> 

          <input id='nys' type='checkbox' name='toggle' value='nys' autocomplete="off">
          <label id = 'nyscolor' for='nys' style='color:#d62728'> NYS Historical Newspaper or Fulton</label><br/> 

          <input id='ebof' type='checkbox' name='toggle' value='ebof' autocomplete="off">
          <label id = 'ebofcolor' for='ebof' style='color:#9467bd'> Enigmatic Bills of Fare</label><br/> 

          <input id='lcsoc' type='checkbox' name='toggle' value='lcsoc' autocomplete="off">
          <label id = 'lsccolor' for='lcsoc' style='color:#8c564b'> Chronicling America Social</label><br/> 

          <input id='lcsup' type='checkbox' name='toggle' value='lcsup' autocomplete="off">
          <label id = 'lcsupcolor' for='lcsup' style='color:#e377c2'> Chronicling America Supper</label><br/>

          <input id='lctea' type='checkbox' name='toggle' value='lctea' autocomplete="off">
          <label id = 'lcteacolor' for='lctea' style='color:#7f7f7f'> Chronicling America Tea</label><br/>

          <input id='ppp' type='checkbox' name='toggle' value='ppp' autocomplete="off">
          <label id = 'pppcolor' for='ppp' style='color:#bcbd22'> Peel's Prairies Provinces</label><br/>

          <input id='ean' type='checkbox' name='toggle' value='ean' autocomplete="off">
          <label id = 'eancolor' for='ean' style='color:#17becf'> Early Alberta Newspapers</label><br/>

          <input id='ink' type='checkbox' name='toggle' value='ink' autocomplete="off">
          <label id = 'inkcolor' for='ink' style='color:#006411'> INK Our Digital World Newspaper Archive</label><br/>


        </div>
      </div>
    </div>

    <div id = "hiderbutton"> 
      <button id = 'keyHider' type="button" onclick="hideFilters()">Hide sidebar</button>
    </div>    
  </div>
  
  <div id = "clusterbutton">
        <button id = 'toggleClusters' type="button" onclick="changeClustering()">Group by region (disables filters)</button>
  </div>
  
  <script src='js/filters.js'></script>
</body>
</html>mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';

// Initialize filters
var startYearFilter = ['>=', ['number', ['get', 'Year']], 1892];
var endYearFilter = ['<=', ['number', ['get', 'Year']], 1892];
var typeFilter = ['!=', ['number', ['get', 'Type']], -1];
var onlyMenus = ['!=', ['number', ['get', 'has_menu']], -1];

function showHideMenu(element, button) {
  var x = document.getElementById(element);
  var y = document.getElementById(button);
  if (x.style.display === "none") {
    x.style.display = "block";
    y.innerHTML = 'Hide menu'
  } else {
    x.style.display = "none";
    y.innerHTML = 'Show menu'
  }
}

function hideFilters(){
	// Inner HTML
	showCommentaryClusters = 'Show sidebar (disables grouping)';
	showCluster = 'Group by region (disables filters)';
	hideSidebar = 'Hide sidebar';
	showSidebar = 'Show sidebar';
	disableCluster = 'Disable grouping';

	var x = document.getElementById("console");
	var y = document.getElementById('keyHider');

	if (x.style.display === "none") {
		x.style.display = "block";
		if (y.innerHTML === showCommentaryClusters){
			document.getElementById('toggleClusters').innerHTML = showCluster;
			unclusterPoints();
		}
		y.innerHTML = hideSidebar;
	} else {
		x.style.display = "none";
		y.innerHTML = showSidebar;
	}
}

function changeClustering(){
	// Inner HTML
	showCommentaryClusters = 'Show sidebar (disables grouping)';
	showCluster = 'Group by region (disables filters)';
	hideSidebar = 'Hide sidebar';
	showSidebar = 'Show sidebar';
	disableCluster = 'Disable grouping';

	var x = document.getElementById("console");
	var y = document.getElementById('keyHider');
	var z = document.getElementById('toggleClusters');

	if (x.style.display === "none") {
		if (y.innerHTML === showCommentaryClusters){
			x.style.display = "block";
			y.innerHTML = hideSidebar;
			z.innerHTML = showCluster;
			unclusterPoints();
			return true;
		}
	} else {
		x.style.display = "none";
	}
	y.innerHTML = showCommentaryClusters;
	z.innerHTML = disableCluster;
	clusterPoints();
	return true;
}

// STARTING POINT
var map = new mapboxgl.Map({
	container: 'map', // container id specified in the HTML
	style: 'mapbox://styles/mapbox/light-v10', // style URL
	center: [-90, 50], // initial map center in [lon, lat]
	zoom: 2.2
});



function clusterPoints(){
	map.removeLayer('unclustered-point')
	
	map.addLayer({
		id: "points",
		type: "circle",
		source: "clustered-conundrums",
		filter: ["!", ["has", "point_count"]],
		paint: {
			'circle-color': [
				'interpolate',
				['exponential', 1],
				['number', ['get', 'Type']],
				0, document.getElementById('banqcolor').style.color,
				1, document.getElementById('bchncolor').style.color,
				2, document.getElementById('bnacolor').style.color,
				3, document.getElementById('eancolor').style.color,
				4, document.getElementById('ebofcolor').style.color,
				5, document.getElementById('inkcolor').style.color,
				6, document.getElementById('lsccolor').style.color,
				7, document.getElementById('lcsupcolor').style.color,
				8, document.getElementById('lcteacolor').style.color,
				9, document.getElementById('nyscolor').style.color,
				10, document.getElementById('pppcolor').style.color,

			],
			'circle-opacity': 0.8
		},
	});

	map.addLayer({
		id: "clusters",
		type: "circle",
		source: "clustered-conundrums",
		filter: ["has", "point_count"],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			//	 * Blue, 20px circles when point count is less than 100
			//	 * Yellow, 30px circles when point count is between 100 and 750
			//	 * Pink, 40px circles when point count is greater than or equal to 750
			"circle-color": ["step",["get", "point_count"],"#51bbd6",20,"#f1f075",100,"#f28cb1"],
			"circle-radius": ["step",["get", "point_count"],20,100,30,750,40],
		},
	});

	map.addLayer({
		id: "cluster-count",
		type: "symbol",
		source: "clustered-conundrums",
		filter: ["has", "point_count"],
		layout: {
			"text-field": "{point_count_abbreviated}",
			"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
			"text-size": 12
		},
	});

	// inspect a cluster on click
	map.on('click', 'clusters', function (e) {
		var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
		var clusterId = features[0].properties.cluster_id;
		map.getSource('clustered-conundrums').getClusterExpansionZoom(clusterId, function (err, zoom) {
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

	// CLICKABLE POINTS
	// When a click event occurs on a feature in the places layer, open a popup at the
	// location of the feature, with description HTML from its properties.
	map.on('click', 'points', function (e) {
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
	map.on('mouseenter', 'points', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	 
	// Change it back to a pointer when it leaves.
	map.on('mouseleave', 'points', function () {
		map.getCanvas().style.cursor = '';
	});
}

function unclusterPoints(){
	map.removeLayer('clusters')
	map.removeLayer('cluster-count')
	map.removeLayer('points')
	
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
			0, document.getElementById('banqcolor').style.color,
			1, document.getElementById('bchncolor').style.color,
			2, document.getElementById('bnacolor').style.color,
			3, document.getElementById('eancolor').style.color,
			4, document.getElementById('ebofcolor').style.color,
			5, document.getElementById('inkcolor').style.color,
			6, document.getElementById('lsccolor').style.color,
			7, document.getElementById('lcsupcolor').style.color,
			8, document.getElementById('lcteacolor').style.color,
			9, document.getElementById('nyscolor').style.color,
			10, document.getElementById('pppcolor').style.color,

			],
			'circle-opacity': 0.8
		},
	});
}

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

// BUILD MAP
map.on('load', function() {
	map.addSource("conundrums", {
		type: "geojson",
		data: "visualizations/data.geojson",
	});

	map.addSource("clustered-conundrums", {
		type: "geojson",
		data: "data.geojson",
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
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
			0, document.getElementById('banqcolor').style.color,
			1, document.getElementById('bchncolor').style.color,
			2, document.getElementById('bnacolor').style.color,
			3, document.getElementById('eancolor').style.color,
			4, document.getElementById('ebofcolor').style.color,
			5, document.getElementById('inkcolor').style.color,
			6, document.getElementById('lsccolor').style.color,
			7, document.getElementById('lcsupcolor').style.color,
			8, document.getElementById('lcteacolor').style.color,
			9, document.getElementById('nyscolor').style.color,
			10, document.getElementById('pppcolor').style.color,

			],
			'circle-opacity': 0.8
		},
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

		map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter, onlyMenus]);
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

		map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter, onlyMenus]);
		// update text in the UI
		document.getElementById('inputend').value = endyear;
	};

	// update start year when text is entered
	
	document.getElementById('inputstart').onkeydown = function(e) {
		if (e.keyCode == 13 || e.keyCode==9){
			var n = parseInt(document.getElementById('inputstart').value)
			if (isNaN(n)){
				startyear = startyear
			} else if (n < 1878) {
				startyear = 1878
			} else if (n > 1971) {
				startyear = 1971
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
		if (e.keyCode == 13 || e.keyCode==9) {
			var n = parseInt(document.getElementById('inputend').value)
			
			if (isNaN(n)){
				endyear = endyear
			} else if (n < 1878) {
				endyear = 1878
			} else if (n > 1971) {
				endyear = 1971
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
	var curTypes = [0,1,2,3,4,5,6,7,8,9,10];
	var checkedAll = true;
	var toggles = ['banq', 'bchn', 'bna', 'ean', 'ebof', 'ink', 'lcsoc','lcsup', 'lctea', 'nys', 'ppp'];
	
	// FILTER BUTTONS
	document.getElementById('archive-filters').addEventListener('change', function(e) {
		// type indicates the archive which was just checked
		var type = e.target.value;

		// if the all archives button is checked
		if (type === 'all') {
			curTypes = [0,1,2,3,4,5,6,7,8,9,10];
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
			curTypes = [0,1,2,3,4,5,6,7,8,9,10];
			checkedAll = true
		}
		// assign the proper state to the show all archives checkbox
		document.getElementById('all').disabled = checkedAll
		document.getElementById('all').checked = checkedAll
		typeFilter = ['match', ['get', 'Type'], curTypes, true, false]
		// assign the correct filter depending on whether the time slider should be ignored
		if (ignoreSlider){
			map.setFilter('unclustered-point', ['all', typeFilter, onlyMenus])
		} else{
			map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter, onlyMenus]);
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
			map.setFilter('unclustered-point', ['all', typeFilter, onlyMenus]);

		} else {
			// enable slider
			for (id of ids) {
				document.getElementById(id).disabled = false;
			}
			map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter, onlyMenus]);
		}
	});

	// Only show riddles with menus
	document.getElementById('menuShower').addEventListener('change', function(e) {
		checked = e.target.checked
		// update the map filter
		if (checked) {
			onlyMenus = ['==', ['number', ['get', 'has_menu']], 1];
		} else {
			onlyMenus = ['!=', ['number', ['get', 'has_menu']], -1];
		}

		if (!ignoreSlider){
			map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter, onlyMenus]);
		}
		else{
			map.setFilter('unclustered-point', ['all', typeFilter, onlyMenus]);
		}
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