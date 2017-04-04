var bodyParser = require("body-parser");
var http = require("http");
var sensorModule = require("../modules/sensor");

module.exports = function(app,express,config){
	var apiRouter = express.Router();

	apiRouter.route("/live")
	.get(function(req, res){
		// console.log("request received");
		var server = {
			hostname:config['serverIP'],
			port:config['serverPort'],
			path:config['path']
		};

		var output = "";
		var request = http.get(server,function(results){
			results.on('data',function(chunk){
				output += chunk;
			});

			results.on('end',function(){
				var result = JSON.parse(output);
				// console.log(result);
				res.json(sensorModule.cache(result));
			});
		});
		request.on('error',function(err){
			console.log(err);
		});		
	})
	
	apiRouter.route("/live/:sensorId")
	.post(function(req,res){
		var sensorId = req.params.sensorId;
		// console.log("sensor id: "+sensorId);
		sensorModule.addFilter(sensorId);
		res.json({"message":"filtering out sensor "+sensorId});
	});

	apiRouter.route("/historical")
	.get(function(req,res){
		result.json({'message':'testing'});
	});

	apiRouter.route("/historical/sensor/:sensorId")
	.post(function(req,res){
		var sensorId = req.params.sensorId;
		// console.log("sensor id: "+sensorId);
		sensorModule.addFilter(sensorId);
		res.json({"message":"filtering out sensor "+sensorId});
	});

	apiRouter.route("/historical/freq/:frequency")
	.post(function(req,res){
		var freq = req.params.frequency;
		console.log("filtering frequency:"+freq);
		res.json({"message":"passing frequency: "+freq});
	});

	apiRouter.route("/historical/time/:timeRange")
	.post(function(req,res){
		var timeRange = req.params.timeRange;
		console.log("filtering times:"+timeRange);
		res.json({"message":"passing times: "+timeRange});
	});

	apiRouter.route("/historical/date/:dateRange")
	.post(function(req,res){
		var dateRange = req.params.dateRange;
		console.log("filtering dates:"+dateRange);
		res.json({"message":"passing dates: "+dateRange});
	});		

	return apiRouter;
};
