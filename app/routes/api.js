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
		var sensors = req.body.sensors;

		console.log("received request :");
		console.log("request freq: "+freq);
		if(sensors.length > 0){
			sensors.forEach(function(sensor){
				console.log("request sensor id: "+sensor);
			});
		}

		res.json({"message":"received filtered request"});
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
