//First Create Variables
var attSel = 'Bach'
var yearSel = '2010'
var attyear = attSel+yearSel
var data = chicagoTracts;
var map = L.map('map').setView([41.835954, -87.630993], 10);

map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
	

// control that shows state info on hover
var info = L.control({position:'bottomright'});

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>'+ yearSel + ' Bachelors or above %</h4>' +  (props ?
			'<b>' + props[attyear] + '%' + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state');
	};

	info.addTo(map);

var chicagoNHjson = L.geoJson(chicagoNH, {
		style: nhstyle,
		onEachFeature: function(feature, marker) {
			marker.bindPopup('<h4>' + feature.properties.PRI_NEIGH+'</h4>');
		}
	});
	
var tractjson = new L.geoJson(data, {
		style: tractstyle,
		onEachFeature: onEachFeature
	});
	
var nhSearch = new L.Control.Search({		
		layer:chicagoNHjson,
		propertyName: "PRI_NEIGH",
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
		
		chicagoNHjson.eachLayer(function(layer) {
			chicagoNHjson.resetStyle(layer);
		});
	});

	map.addControl( nhSearch );
	
	map.addLayer(chicagoNHjson);
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
// get color depending on population density value
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
	
	
//Styles for tracts
function tractstyle(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColorBach(feature.properties[attyear])
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
								from + (to ? '%'+'&ndash;' + to + '%' : '%+'));
						}

					legdiv.innerHTML = labels.join('<br>');
					return legdiv;
					};
					var color = getColorBachChange(props[attyear]);
				}
				legend.remove();
				legend.addTo(map);
				}
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
		this._div.innerHTML = '<h4>'+ yearSel +' Bachelors or above %</h4>' +  (props ?
			'<b>' + props[attyear] + '%' + '</b><br />' + props.NH +'<br/>'+ props.TractName
			: 'Hover over a state');
		};}
	})
