var bodyParser = require("body-parser");
var db = require("../modules/dbUtils");

module.exports = function(app,express,config){	
	var apiRouter = express.Router();
	db.init(config);

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
			res.json(readings);
		});

		// res.json({"message":"received filtered request"});
	})

	apiRouter.route("/historical")
	.get(function(req,res){
		result.json({'message':'historical page'});
	});

	apiRouter.route("/historical/readings")
	.post(function(req,res){
		res.json({"message":"getting historical readings"});
	});

	return apiRouter;
};
