var bodyParser = require("body-parser");
var http = require("http");

module.exports = function(app,express){

	var apiRouter = express.Router();
	var sensorFilters = [];

	// apiRouter.get("/live", function(req, res){
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
				var obj = JSON.parse(output);				
				// console.log(obj);
				obj.forEach(function(sensor){
					//do not check sensor checkbox if filtered out
					if(sensorFilters.length === 0){
						// console.log("filters are empty");
						sensor.isActive = true;
					}else{
						console.log("there are filters");
						if( sensorFilters.indexOf(sensor.id) > -1){
							console.log("setting sensor "+sensor.id+" to inactive");
							sensor.isActive = false;
						}else{
							console.log("filters contains: "+sensorFilters[0]);
							console.log("setting sensor "+sensor.id+" to active");							
							sensor.isActive = true;
						}
					}
				});
				res.json(obj);
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

		sensorFilters.push(sensorId);
		console.log("filters len "+sensorFilters.length );

		res.json({"message":"filtering out sensor "+sensorId});
	});

	return apiRouter;
};
