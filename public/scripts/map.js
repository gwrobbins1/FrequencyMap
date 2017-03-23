// window.app = {};
// var app = window.app;

// var map = new ol.Map({
// 	target:'map',
// 	layers:[
// 		new ol.layer.Tile({
// 			source: new ol.source.OSM()
// 		})
// 	],
// 	view: new ol.View({
// 		center: ol.proj.fromLonLat([-81.2,28.6]),
// 		zoom:15
// 	})
// });

// app.map = map;

var mapModule = (function(){
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

	var getMap = function(){
		return map;
	};

	var plotSensor = function(location){
		let lon = location[0];
		let lat = location[1];


	};

	var makeSensorFeatureArray = function(sensorData){
		let features = [];

		// let sensorStyle = new ol.style.Style({
		// 	image:new ol.style.Icon({
		// 		src: '../images/sensor.jpg'
		// 	})
		// });

		let sensorStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius:5,
				fill : new ol.style.Fill({color: [0,0,0]})
			})
		});

		sensorData.forEach(function(sensor){
						
			// let loc = sensor.location;			
			let loc = ol.proj.transform(sensor.location,'EPSG:4326','EPSG:3857');
			let feature = new ol.Feature({
				geometry:new ol.geom.Point(loc)
			});
			feature.setId(sensor.id);
			feature.setStyle(sensorStyle);
			features.push(feature);
		});
		return features;		
	};

	var addSensorLayer = function(featureArray){
		// let featureCollection = new ol.Collection(featureArray);
		map.addLayer(new ol.layer.Vector({
			source:new ol.source.Vector({
				features:new ol.Collection(featureArray)
			}),
			style:new ol.style.Style({
				fill : new ol.style.Fill({color: [0,0,0]})
			}),
			name:"sensorLayer"
		}));
	};

	var removeSensorLayer = function(){
		let foundException = {};//needed to break loop
		try{
			map.getLayers().forEach(function(layer){
				let layerName = layer.getName();
				if( layerName && layerName == "sensorLayer" ){
					map.removerLayer(layer);
					throw new foundException();
				}
			});
		}catch(ignore){}
	};

	return {
		getMap : getMap,
		plotSensor : plotSensor,
		makeSensorFeatureArray : makeSensorFeatureArray,
		addSensorLayer : addSensorLayer,
		removeSensorLayer : removeSensorLayer
	};
})();