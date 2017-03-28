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

	var makeSensorFeatureArray = function(sensorData){
		let features = [];

		let sensorStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius:5,
				fill : new ol.style.Fill({color: [0,0,0]})
			})
		});

		sensorData.forEach(function(sensor){						
			// let loc = sensor.location;
			if(sensor.isActive){
				let loc = ol.proj.transform(sensor.location,'EPSG:4326','EPSG:3857');
				let feature = new ol.Feature({
					geometry:new ol.geom.Point(loc)
				});
				feature.setId(sensor.id);
				feature.setStyle(sensorStyle);
				features.push(feature);
			}
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

	var removeSensor = function(feature){
		let found = {};
		try{
			map.getLayers().forEach(function(layer){
				if(layer.get('name') === "sensorLayer"){
					let src = layer.getSource();
					src.removeFeature(feature);
					throw new found();
				}
			});
		}catch(ignore){}
	};

	var removeSensorHeatmap = function(feature){
		let found = {};
		try{
			map.getLayers().forEach(function(layer){
				if(layer.get('name') === "heatmap"){
					let src = layer.getSource();
					src.removeFeature(feature);
					throw new found();
				}
			});
		}catch(ignore){}
	};

	var addSensor = function(sensorFeature){
		let found = {};
		try{
			map.getLayers().forEach(function(layer){
				if(layer.get('name') === "sensorLayer"){
					let src = layer.getSource();
					src.addFeature(sensorFeature);
					throw new found();
				}
			});
		}catch(ignore){}		
	};

	var plotHeatmap = function(value,sensorArray){
		if(value === 0){
			map.getLayers().forEach(function(layer){
				if(layer.get('name') === 'heatmap'){
					map.removeLayer(layer);
				}
			});			
			return [];
		}
		let features = [];
		sensorArray.forEach(function(sensor){
			if(sensor.isActive){
				let loc = ol.proj.transform(sensor.location,'EPSG:4326','EPSG:3857');
				let feature = new ol.Feature({
					geometry:new ol.geom.Point(loc),
					weight:(sensor.readings[value] / 100)
				});
				feature.setId(sensor.id);
				features.push(feature);
			}
		});

		let found = false;
		map.getLayers().forEach(function(layer){
			if(layer.get('name') === 'heatmap'){
				found = true;
				let src = layer.getSource();
				src.clear();
				src.addFeatures(features);
				// src.addFeatures(sensorFeatureArray);
			}
		});

		if(! found){
			let heatMapLayer = new ol.layer.Heatmap({
				source: new ol.source.Vector({
					features:new ol.Collection(features)
				})
			});

			map.addLayer(heatMapLayer);
			heatMapLayer.set('name','heatmap');
		}

		return features;
	};

	return {
		makeSensorFeatureArray : makeSensorFeatureArray,
		addSensorLayer : addSensorLayer,
		removeSensor : removeSensor,
		addSensor : addSensor,
		plotHeatmap : plotHeatmap,
		removeSensorHeatmap : removeSensorHeatmap,
		removeSensorLayer : removeSensorLayer
	};
})();