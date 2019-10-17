mapboxgl.accessToken = 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng';

function hideFilters(){
	var x = document.getElementById("console");
	var y = document.getElementById('keyHider');

	if (x.style.display === "none") {
		x.style.display = "block";
		y.innerHTML = 'Hide commentary';
	} else {
		x.style.display = "none";
		y.innerHTML = 'Show commentary';
	}
}
function changeClustering(){
	var x = document.getElementById("console");
	var y = document.getElementById('keyHider');
	var z = document.getElementById('toggleClusters');

	if (x.style.display === "none") {
		if (y.style.display === 'none'){
			x.style.display = "block";
			y.style.display = 'block';
			z.innerHTML = 'Enable clustering';
			unclusterPoints()
		}
		else{
			y.style.display = 'none';
			y.innerHTML = 'Hide commentary';
			z.innerHTML = 'Disable clustering'
			clusterPoints()
		}
	} else {
		x.style.display = "none";
		y.style.display = 'none';
		z.innerHTML = 'Disable clustering'
		clusterPoints()
	}
}

// STARTING POINT
var map = new mapboxgl.Map({
	container: 'map', // container id specified in the HTML
	style: 'mapbox://styles/mapbox/light-v10', // style URL
	center: [-90, 50], // initial map center in [lon, lat]
	zoom: 2.2
});

// Initialize filters
var startYearFilter = ['>=', ['number', ['get', 'Year']], 1892];
var endYearFilter = ['<=', ['number', ['get', 'Year']], 1892];
var typeFilter = ['!=', ['number', ['get', 'Type']], -1];
var colors = [document.getElementById('banqcolor').style.color, document.getElementById('bchncolor').style.color, 
			  document.getElementById('bnacolor').style.color, document.getElementById('lsccolor').style.color,
			  document.getElementById('lcsupcolor').style.color, document.getElementById('lcteacolor').style.color,
			  document.getElementById('nyscolor').style.color,]
			  
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
				3, document.getElementById('lsccolor').style.color,
				4, document.getElementById('lcsupcolor').style.color,
				5, document.getElementById('lcteacolor').style.color,
				6, document.getElementById('nyscolor').style.color,
			],
			'circle-opacity': 0.8
		},
	});

	// objects for caching and keeping track of HTML marker objects (for performance)
	var markers = {};
	var markersOnScreen = {};
	 
	function updateMarkers() {
		var newMarkers = {};
		var features = map.querySourceFeatures('clustered-conundrums');
	 
		// for every cluster on the screen, create an HTML marker for it (if we didn't yet),
		// and add it to the map if it's not there already
		for (var i = 0; i < features.length; i++) {
			var coords = features[i].geometry.coordinates;
			var props = features[i].properties;
			if (!props.cluster) continue;
				var id = props.cluster_id;
		 
			var marker = markers[id];
			if (!marker) {
				var el = createDonutChart(props);
				marker = markers[id] = new mapboxgl.Marker({element: el}).setLngLat(coords);
		}

		newMarkers[id] = marker;
		 
		if (!markersOnScreen[id])
			marker.addTo(map);
		}

		// for every marker we've added previously, remove those that are no longer visible
		for (id in markersOnScreen) {
			if (!newMarkers[id])
			markersOnScreen[id].remove();
		}
		markersOnScreen = newMarkers;
	}
	 
	// after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
	map.on('data', function (e) {
		if (e.sourceId !== 'clustered-conundrums' || !e.isSourceLoaded) return;
	 
		map.on('move', updateMarkers);
		map.on('moveend', updateMarkers);
		updateMarkers();
	});
	 
	// code for creating an SVG donut chart from feature properties
	function createDonutChart(props) {
		var offsets = [];
		var counts = [props.mag1, props.mag2, props.mag3, props.mag4, props.mag5];
		var total = 0;
		for (var i = 0; i < counts.length; i++) {
			offsets.push(total);
			total += counts[i];
		}
		var fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
		var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
		var r0 = Math.round(r * 0.6);
		var w = r * 2;
	 
		var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
		'" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">';
	 
		for (i = 0; i < counts.length; i++) {
			html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colors[i]);
		}
		html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
		'" fill="white" /><text dominant-baseline="central" transform="translate(' +
		r + ', ' + r + ')">' + total.toLocaleString() + '</text></svg>';
	 
		var el = document.createElement('div');
		el.innerHTML = html;
		return el.firstChild;
	}
	 
	function donutSegment(start, end, r, r0, color) {
		if (end - start === 1) end -= 0.00001;
		var a0 = 2 * Math.PI * (start - 0.25);
		var a1 = 2 * Math.PI * (end - 0.25);
		var x0 = Math.cos(a0), y0 = Math.sin(a0);
		var x1 = Math.cos(a1), y1 = Math.sin(a1);
		var largeArc = end - start > 0.5 ? 1 : 0;
	 
		return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
		'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
		'L', r + r0 * x1, r + r0 * y1, 'A',
		r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
		'" fill="' + color + '" />'].join(' ');
	}

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
			3, document.getElementById('lsccolor').style.color,
			4, document.getElementById('lcsupcolor').style.color,
			5, document.getElementById('lcteacolor').style.color,
			6, document.getElementById('nyscolor').style.color,
			],
			'circle-opacity': 0.8
		},
	});
}

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

banq = ['match', ['get', 'Type'], [0], true, false]
bchn = ['match', ['get', 'Type'], [1], true, false]
bna = ['match', ['get', 'Type'], [2], true, false]
lsc = ['match', ['get', 'Type'], [3], true, false]
lcs = ['match', ['get', 'Type'], [4], true, false]
lct = ['match', ['get', 'Type'], [5], true, false]
nys = ['match', ['get', 'Type'], [6], true, false]


// BUILD MAP
map.on('load', function() {
	map.addSource("conundrums", {
		type: "geojson",
		data: "data.geojson",
	});

	map.addSource("clustered-conundrums", {
		type: "geojson",
		data: "data.geojson",
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
		clusterProperties: { // keep separate counts for each archive in the cluster
			"banq": ["+", ["case", banq, 1, 0]],
			"bchn": ["+", ["case", bchn, 1, 0]],
			"bna": ["+", ["case", bna, 1, 0]],
			"lsc": ["+", ["case", lsc, 1, 0]],
			"lcs": ["+", ["case", lcs, 1, 0]],
			"lct": ["+", ["case", lct, 1, 0]],
			"nys": ["+", ["case", nys, 1, 0]],
		}
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
				3, document.getElementById('lsccolor').style.color,
				4, document.getElementById('lcsupcolor').style.color,
				5, document.getElementById('lcteacolor').style.color,
				6, document.getElementById('nyscolor').style.color,
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

		map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter]);
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

		map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter]);
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
		if (e.keyCode == 13 || e.keyCode==9) {
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
	document.getElementById('archive-filters').addEventListener('change', function(e) {
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
			map.setFilter('unclustered-point', ['all', typeFilter])
		} else{
			map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter]);
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
			map.setFilter('unclustered-point', ['all', typeFilter]);

		} else {
			// enable slider
			for (id of ids) {
				document.getElementById(id).disabled = false;
			}
			map.setFilter('unclustered-point', ['all', startYearFilter, endYearFilter, typeFilter]);
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