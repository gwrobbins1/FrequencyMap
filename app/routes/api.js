var bodyParser = require("body-parser");
var http = require("http");
var sensorModule = require("../modules/sensor");

module.exports = function(app,express){
	var apiRouter = express.Router();

	apiRouter.route("/live")
	.get(function(req, res){
		// console.log("request received");
		var testServer = {
			hostname:"127.0.0.1",
			port:8080,
			path:"/FrequencyMapTest/Test"
		};
		var output = "";
		var request = http.get(testServer,function(results){
			results.on('data',function(chunk){
				output += chunk;
			});

			results.on('end',function(){
				res.json(sensorModule.cache(JSON.parse(output)));
			});
		});
		request.on('error',function(err){
			console.log(err);
		});		
	})
	
	apiRouter.route("/live/:sensorId")
	.post(function(req,res){
		var sensorId = req.params.sensorId;
		console.log("sensor id: "+sensorId);
		sensorModule.addFilter(sensorId);
		res.json({"message":"filtering out sensor "+sensorId});
	});

	return apiRouter;
};
