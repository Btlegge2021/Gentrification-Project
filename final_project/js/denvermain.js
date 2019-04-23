//First Create Variables
var attSel = 'Bach'
var yearSel = '2010'
var attyear = attSel+yearSel
var data = denverTracts;
var map = L.map('map').setView([39.713363, -104.952016], 12);

map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
	

// control that shows state info on hover
var info = L.control({position:'bottomright'});

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel + ' Bachelors or above %</h4>' + '<h5>' +  (props ?
			'<b>' + props[attyear] + '%' + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
	};

	info.addTo(map);

var denverNHjson = L.geoJson(denverNH, {
		style: nhstyle,
		onEachFeature: function(feature, marker) {
			marker.bindPopup('<h4>' + feature.properties.NBHD_NAME+'</h4>');
		}
	});
	
var tractjson = new L.geoJson(data, {
		style: tractstyle,
		onEachFeature: onEachFeature
	});
	
var nhSearch = new L.Control.Search({		
		layer:denverNHjson,
		propertyName: "NBHD_NAME",
		marker: false,
		moveToLocation: function(latlng, title, map) {
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
			map.setView(latlng, zoom);
		}
	});
	
	nhSearch.on('search:locationfound', function(e) {
		e.layer.setStyle({filleColor: '#3f0', color: '#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();
	}).on('search:collapsed',function(e) {
		
		denverNHjson.eachLayer(function(layer) {
			denverNHjson.resetStyle(layer);
		});
	});

	map.addControl( nhSearch );
	
	map.addLayer(denverNHjson);
	map.addLayer(tractjson);
	
var legend = L.control({position: 'bottomleft'});

	legend.onAdd = function (map) {

var legdiv = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
			labels = [],
			from, to;

	for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1]-1;
			labels.push(
				'<i style="background:' + getColorBach(from + 1) + '"></i> ' +
				from + (to ? '%'+'&ndash;' + to + '%' : '%'));
		}

	legdiv.innerHTML = labels.join('<br>');
		return legdiv;
	};
	
	legend.addTo(map);
	
var attDD = L.control({position: 'topright'});
	attDD.onAdd = function (map) {
		
var attdiv = L.DomUtil.create('div', 'info attDD');
    attdiv.innerHTML = '<h4>Select Attribute</h4><select id="attOpt"><option value = "Bach">Bachelors Degree Percent</option><option value = "Home">Average Home Value</option><option value = "Income">Average Income</option></select>';
    attdiv.firstChild.onmousedown = attdiv.firstChild.ondblclick = L.DomEvent.stopPropagation;
		return attdiv;
		};
	attDD.addTo(map);
	
var yearDD = L.control({position: 'topright'});
		yearDD.onAdd = function (map) {
var yeardiv = L.DomUtil.create('div', 'info yearDD');
	yeardiv.innerHTML = '<h4>Select Year</h4><select id="yearOpt"><option value="2010">2010</option><option value="2017">2017</option><option value = "Change">Change</option></select>';
	yeardiv.firstChild.onmousedown = yeardiv.firstChild.ondblclick = L.DomEvent.stopPropagation;
		return yeardiv;
	};
	yearDD.addTo(map);

//Create Functions
//Color functions
function getColorBach(d) {
		return  d >= 100 ? '#BF0F00' :
				d > 90  ? '#BF065B' :
				d > 80  ? '#C00DBF' :
				d > 70  ? '#6413C0' :
				d > 60  ? '#1A27C1' :
				d > 50  ? '#2183C2' :
				d > 40  ? '#28C2AB' :
				d > 30  ? '#2FC35D' :
				d > 20  ? '#56C336' :
				d > 10  ? '#A4C43D' :
				'#C59E44';
	}
	
function getColorBachChange(d) {
	return  d > 35  ? '#BF0F00' :
			d > 30  ? '#C00DBF' :
			d > 25  ? '#6413C0' :
			d > 20  ? '#1A27C1' :
			d > 15  ? '#2183C2' :
			d > 10  ? '#28C2AB' :
			d > 5   ? '#2FC35D' :
			d > 0  	? '#56C336' :
			d > -10 ? '#A4C43D' :
			'#C59E44';
	}
	
function getColorHome (d) {
	return  d > 957500  ? '#BF0F00' :
			d > 861750  ? '#BF065B' :
			d > 766000  ? '#C00DBF' :
			d > 670250  ? '#6413C0' :
			d > 574500  ? '#1A27C1' :
			d > 478750  ? '#2183C2' :
			d > 383000  ? '#28C2AB' :
			d > 287250  ? '#2FC35D' :
			d > 191500  ? '#56C336' :
			d > 95750  ? '#A4C43D' :
			'#C59E44';
	}
	
function getColorHChange(d) {
	return  d > 245300   ? '#BF0F00' :
			d > 207900   ? '#C00DBF' :
			d > 170600   ? '#6413C0' :
			d > 133200    ? '#1A27C1' :
			d > 95900   ? '#2183C2' :
			d > 58500   ? '#28C2AB' :
			d > 21200   ? '#2FC35D' :
			d > -16200  ? '#56C336' :
			d > -53500  ? '#A4C43D' :
			'#C59E44';
	}
	
function getColorIncome (d) {
	return  d > 179600  ? '#BF0F00' :
			d > 161700  ? '#BF065B' :
			d > 143700  ? '#C00DBF' :
			d > 125800  ? '#6413C0' :
			d > 107800  ? '#1A27C1' :
			d > 89800   ? '#2183C2' :
			d > 71900   ? '#28C2AB' :
			d > 53900   ? '#2FC35D' :
			d > 35900   ? '#56C336' :
			d > 18000   ? '#A4C43D' :
			'#C59E44';
	}
	
function getColorIChange(d) {
	return  d > 51750  ? '#BF0F00' :
			d > 32400  ? '#C00DBF' :
			d > 13000  ? '#6413C0' :
			d > -6400  ? '#1A27C1' :
			d > -25800  ? '#2183C2' :
			d > -45100   ? '#28C2AB' :
			d > -64500   ? '#2FC35D' :
			d > -83900  ? '#56C336' :
			d > -103300 ? '#A4C43D' :
			'#C59E44';
	}
//Styles for tracts initialized with Bachelors stats
function tractstyle(feature) {
		if(attSel == 'Bach'){
			var color = getColorBach(feature.properties[attyear])
			if(yearSel == 'Change'){
				var color = getColorBachChange(feature.properties[attyear])}}
		if(attSel == 'Home'){
			var color = getColorHome(feature.properties[attyear])
			if(yearSel == 'Change'){
				var color = getColorHChange(feature.properties[attyear])}}
		if(attSel == 'Income'){
			var color = getColorIncome(feature.properties[attyear])
			if(yearSel == 'Change'){
				var color = getColorIChange(feature.properties[attyear])}}
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: color
		};
	}
//Style for Neighborhoods
function nhstyle(feature) {
		return {
			opacity: 0
		};
	}
	
function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

function resetHighlight(e) {
		tractjson.resetStyle(e.target);
		//console.log(e.target);
		info.update();
	}

function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}
	
function updateMap(map,att,year){
	yearSel = year;
	attSel = att;
	attyear = attSel + yearSel;
	var findLayers = new L.layerGroup();
	map.eachLayer(function(layer){
		findLayers.addLayer(layer);
		if(layer.feature && layer.feature.properties[attyear]){
			var props = layer.feature.properties;
			if(attSel == 'Bach'){
			legend.onAdd = function (map) {
				var legdiv = L.DomUtil.create('div', 'info legend'),
					grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
					labels = [],
					from, to;

				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1]-1;
					labels.push(
						'<i style="background:' + getColorBach(from + 1) + '"></i> ' +
						 from + (to ? '%'+'&ndash;' + to + '%' : '%'));
					}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					
				var color = getColorBach(props[attyear]);
				if(yearSel == 'Change'){
						legend.onAdd = function (map) {
							var legdiv = L.DomUtil.create('div', 'info legend'),
								grades = [-10, 0, 5, 10, 15, 20, 25, 30, 35],
								labels = [],
								from, to;

							for (var i = 0; i < grades.length; i++) {
								from = grades[i];
								to = grades[i + 1]-1;
								labels.push(
								'<i style="background:' + getColorBachChange(from + 1) + '"></i> ' +
								from + (to ? '%'+'&ndash; ' + to + '%' : '%+'));
						}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					var color = getColorBachChange(props[attyear]);
				}}
				
				if(attSel == 'Home'){
					legend.onAdd = function (map) {
				var legdiv = L.DomUtil.create('div', 'info legend'),
					grades = [0, 95750, 191500, 287250, 383000, 478750, 574500, 670250, 766000, 861750, 957500],
					labels = [],
					from, to;

				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1]-1;
					labels.push(
						'<i style="background:' + getColorHome(from + 1) + '"></i> ' +
						 from + (to ? '&ndash;' + to : '+'));
					}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					
				var color = getColorHome(props[attyear]);
				
				if(yearSel == 'Change'){
						legend.onAdd = function (map) {
							var legdiv = L.DomUtil.create('div', 'info legend'),
								grades = [-53500, -16200, 21200, 58500, 95900, 133200, 170600, 207900, 245300],
								labels = [],
								from, to;

							for (var i = 0; i < grades.length; i++) {
								from = grades[i];
								to = grades[i + 1]-1;
								labels.push(
									'<i style="background:' + getColorHChange(from + 1) + '"></i> ' +
									from + (to ? '&ndash; ' + to : '+'));
						}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					var color = getColorHChange(props[attyear]);
				}}
				
				if(attSel == 'Income'){
					legend.onAdd = function (map) {
				var legdiv = L.DomUtil.create('div', 'info legend'),
					grades = [0,18000, 35900, 53900, 71900, 89800, 107800, 125800, 143700, 161700, 179600],
					labels = [],
					from, to;

				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1]-1;
					labels.push(
						'<i style="background:' + getColorIncome(from + 1) + '"></i> ' +
						 from + (to ? '&ndash;' + to : '+'));
					}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					
				var color = getColorIncome(props[attyear]);
				
				if(yearSel == 'Change'){
						legend.onAdd = function (map) {
							var legdiv = L.DomUtil.create('div', 'info legend'),
								grades = [-103300, -83900, -64500, -45100, -25800, -6400, 13000, 32400, 51750],
								labels = [],
								from, to;

							for (var i = 0; i < grades.length; i++) {
								from = grades[i];
								to = grades[i + 1]-1;
								labels.push(
									'<i style="background:' + getColorIChange(from + 1) + '"></i> ' +
									from + (to ? '&ndash; ' + to : '+'));
						}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					var color = getColorIChange(props[attyear]);
				}}
				
				
				
				legend.remove();
				legend.addTo(map);
			var options = {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: color
			};
			layer.setStyle(options);
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
			layer.redraw();
			layer.addTo(map);
		};
	});
};
	
//Jquery
$('#yearOpt').change(function(){
		yearID = document.getElementById('yearOpt');
		yearVal = yearID.options[yearID.selectedIndex].value;
		updateMap(map,attSel,yearVal);
		if(attSel == 'Bach'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Bachelors or above %</h4>' + '<h5>' + (props ?
			'<b>' + props[attyear] + '%' + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		
		if(attSel == 'Home'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Median Home Value in Dollars</h4>' + '<h5>' + (props ?
			'<b>'+ '$' + props[attyear] + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		
		if(attSel == 'Income'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Median Income Value in Dollars</h4>' + '<h5>' + (props ?
			'<b>'+ '$' + props[attyear] + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		info.remove();
		info.addTo(map);
	})

$('#attOpt').change(function(){
		attID = document.getElementById('attOpt');
		attVal = attID.options[attID.selectedIndex].value;
		updateMap(map,attVal,yearSel);
		console.log(attyear);
		if(attSel == 'Bach'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Bachelors or above %</h4>' + '<h5>' + (props ?
			'<b>' + props[attyear] + '%' + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		
		if(attSel == 'Home'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Median Home Value in Dollars</h4>' + '<h5>' + (props ?
			'<b>'+ '$' + props[attyear] + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		
		if(attSel == 'Income'){
			info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel +' Median Income Value in Dollars</h4>' + '<h5>' + (props ?
			'<b>'+ '$' + props[attyear] + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state') +'</h5>';
		};}
		info.remove();
		info.addTo(map)
		
	})

	
