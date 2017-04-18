var bodyParser = require("body-parser");
var db = require("../modules/dbUtils");
// var exec = require('child_process').execFile;
var spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function(app,express,config){	
	var apiRouter = express.Router();
	db.init(config);
	var interpolating = false;

	apiRouter.route("/live")
	.get(function(req, res){
		db.getSensors(undefined,function(sensors){
			res.json({'sensors':sensors});
		});
	})
	
	apiRouter.route("/live/sensors")
	.post(function(req,res){
		db.getSensors(undefined,function(sensors){			
			res.json({'sensors':sensors});
		});
	});

	apiRouter.route("/live/readings")
	.post(function(req,res) {
		var freq = req.body.frequency;
		var filteredSensors = req.body.sensors;

		console.log("received request :");
		console.log("request freq: "+freq);
		if(filteredSensors.length > 0){
			filteredSensors.forEach(function(sensor){
				console.log("request sensor id: "+sensor);
			});
		}

		db.getLiveReadings(freq,filteredSensors,function(readings){
			// console.log("got sensor readings");
			//interpolate data
			db.getSensors(undefined,function(sensors){
				// console.log("got sensors for interpolation");
				var interpolationInput = [];
				var numSensors = sensors.length;

				readings.forEach(function(sensorReadings){
					for(var i=0;i<numSensors;i++){
						if(sensorReadings.Sensors_SID === sensors[i].SID){
							interpolationInput.push(sensors[i].Latitude);
							interpolationInput.push(sensors[i].Longitude);
							interpolationInput.push(sensorReadings.READINGS);
						}
					}					
				});

				// console.log(interpolationInput);
				if(!interpolating && interpolationInput.length !== 0){
					interpolating = true;
					//[sensor lat,sensor lon,sensor str@freq, .... for all sensors]
					console.log(interpolationInput.length);					

					const ps = spawn("interpolate.exe",interpolationInput);
					ps.stdout.on('data',function(data){
						interpolating = false;
						console.log(data);
					});
					ps.stderr.on('data',function(data){
						interpolating = false;
						console.log(data);
					});
					ps.on('error',function(err){
						interpolating = false;
						console.log(err);
					});
					ps.on('close',function(code){
						interpolating = false;
						if(code === 0){							
							fs.readFile("./estimatedPoints.json",function(err,data){
								if(err){console.log(err);}
								else{
									// console.log(JSON.parse(data));
									var interpolation = JSON.parse(data);
									res.json({
										'readings':readings,
										'interpolation':interpolation.interpolation
									});
								}
							});
						}else{
							res.json({'readings':readings});
						}
					});
				}else{
					console.log("skipped interpolation part");
					res.json({'readings':readings});
				}
			});
		});
		// res.json({"message":"received filtered request"});
	})

	apiRouter.route("/historical")
	.get(function(req,res){
		result.json({'message':'historical page'});
	});

	apiRouter.route("/historical/readings")
	.post(function(req,res){
		console.log("frequency:"+req.body.freq);
		console.log("start time:"+req.body.start);
		console.log("end time:"+req.body.end);

		db.getHistoricalReadings(req.body.freq,req.body.start,req.body.end,
			function(readings){
				var numSensors = readings.length;
				var interpolationInput = [];
				readings.forEach(function(sensorReadings){
					interpolationInput.push(sensorReadings.Latitude);
					interpolationInput.push(sensorReadings.Longitude);
					interpolationInput.push(sensorReadings.READINGS);

					console.log("Lat"+sensorReadings.Latitude);
					console.log("Lon"+sensorReadings.Longitude);
					console.log("reading"+sensorReadings.Readings);
				});

				if(!interpolating && interpolationInput.length !== 0){
					interpolating = true;
					const ps = spawn("interpolate.exe",interpolationInput);
					ps.stdout.on('data',function(data){
						interpolating = false;
						console.log(data);
					});
					ps.stderr.on('data',function(data){
						interpolating = false;
						console.log(data);
					});
					ps.on('error',function(err){
						interpolating = false;
						console.log(err);
					});
					ps.on('close',function(code){
						interpolating = false;
						console.log("----code:"+code);
						if(code === 0){							
							fs.readFile("./estimatedPoints.json",function(err,data){
								if(err){console.log(err);}
								else{
									// console.log(JSON.parse(data));
									var interpolation = JSON.parse(data);
									interpolating = false;
									res.json({
										'readings':readings,
										'interpolation':interpolation.interpolation
									});
								}
							});
						}else{
							interpolating = false;
							res.json({'readings':readings});
						}
					});
				}else{
					res.json(readings);
				}
			});
	});

	return apiRouter;
};
