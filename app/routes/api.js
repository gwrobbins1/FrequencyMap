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

	return apiRouter;
};
