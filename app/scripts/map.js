window.app = {};
var app = window.app;

var map = new ol.Map({
	target:'map',
	layers:[
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([-81.2,28.6]),
		zoom:15
	})
});

app.map = map;