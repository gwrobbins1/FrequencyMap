var mapModule = (function(){
	var map = new ol.Map({
		target:'map',
		layers:[
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		view: new ol.View({
			center: ol.proj.fromLonLat([-81.2,28.601]),
			zoom:16
		})
	});

	var makeSensorFeatureArray = function(sensorData){
		let features = [];

		let sensorStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius:3,
				fill : new ol.style.Fill({color: [0,0,0]})
			})
		});

		sensorData.forEach(function(sensor){						
			// let loc = sensor.location;
			if(sensor.isActive){
				let loc = [sensor.Longitude,sensor.Latitude];
				loc = ol.proj.transform(loc,'EPSG:4326','EPSG:3857');
				
				let feature = new ol.Feature({
					geometry:new ol.geom.Point(loc)
				});
				feature.setId(sensor.SID);
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
				let loc = [sensor.Longitude,sensor.Latitude];
				loc = ol.proj.transform(loc,'EPSG:4326','EPSG:3857');

				let feature = new ol.Feature({
					geometry:new ol.geom.Point(loc),
					weight:(sensor.READINGS / 100)
				});
				feature.setId(sensor.SID);
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
			}
		});

		if(! found){
			let heatMapLayer = new ol.layer.Heatmap({
				source: new ol.source.Vector({
					features:new ol.Collection(features)					
				}),
				radius:20,
				// blur:0,
				gradient:['#f8ff00',
						  '#e5ec00',
						  '#bdc200',
						  '#ffaa00',
						  '#FF950A',
						  '#FF8300',
						  '#FF680A',
						  '#ff0000',
						  '#c92c2c',
						  '#af0000']
			});

			map.addLayer(heatMapLayer);
			heatMapLayer.set('name','heatmap');
		}

		return features;
	};

	var plotInterpolation = function(data){
		if(data){//could be undefined. is an array			
			let heatmapSrc;
			map.getLayers().forEach(function(layer){
				if(layer.get('name') === "heatmap"){					
					heatmapSrc = layer.getSource();					
				}
			});

			if(heatmapSrc){
				data.forEach(function(point){
					let loc = [point.lon,point.lat];
					loc = ol.proj.transform(loc,'EPSG:4326','EPSG:3857');

					let feature = new ol.Feature({
						geometry:new ol.geom.Point(loc),
						weight:(point.str / 100)
					});

					heatmapSrc.addFeature(feature);
				});
			}
		}
	};

	return {
		makeSensorFeatureArray : makeSensorFeatureArray,
		addSensorLayer : addSensorLayer,
		removeSensor : removeSensor,
		addSensor : addSensor,
		plotHeatmap : plotHeatmap,
		removeSensorHeatmap : removeSensorHeatmap,
		removeSensorLayer : removeSensorLayer,
		plotInterpolation : plotInterpolation
	};
})();