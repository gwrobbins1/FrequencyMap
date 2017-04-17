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
						// console.log(data);
						// var interpJson = JSON.parse(data);
						// console.log(interpJson);
						// console.log("----# of objects in interpolation data "+Object.keys(interpJson.interpolation).length);						
						// interpolating = false;
						// res.json({'readings':readings,'interpolation':interpJson.interpolation});						
					});
					ps.stderr.on('data',function(data){
						console.log(data);
					});
					ps.on('error',function(err){
						console.log(err);
					});
					ps.on('close',function(code){
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
				res.json(readings);
			});
		// res.json({"message":"getting historical readings"});
		// setTimeout(function(){
		// 	res.json({"message":"getting historical readings"});
		// },5e3);
	});

	return apiRouter;
};
