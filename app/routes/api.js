var bodyParser = require("body-parser");
var http = require("http");
var sensorModule = require("../modules/sensor");
var filterModule = require("../modules/filter");

module.exports = function(app,express,config){
	var apiRouter = express.Router();

	var server = {
		hostname:config['serverIP'],
		port:config['serverPort'],
		path:config['path']
	};

	apiRouter.route("/live")
	.get(function(req, res){
		// console.log("request received");

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

		filterModule.addFilter('frequency',freq);
		if( filterModule.isFullSet() ){
			// createHistoricalDataPromise()
			// .then(function(res){
			// 	res.json({"message":"loaded data successfully!"});
			// })
			// .catch(function(rej){
			// 	res.json({"message":"error loading data"});
			// });
			var data = pollTestServer();
			res.json({"message":data});
		}else{
			res.json({"message":"filtering frequency: "+freq});
		}
	});

	apiRouter.route("/historical/time/:timeRange")
	.post(function(req,res){
		var timeRange = req.params.timeRange;
		console.log("filtering times:"+timeRange);
		filterModule.addFilter('timeRange',timeRange);
		if( filterModule.isFullSet() ){
			// createHistoricalDataPromise()
			// .then(function(res){
			// 	res.json({"message":"loaded data successfully!"});
			// })
			// .catch(function(rej){
			// 	res.json({"message":"error loading data"});
			// });
			var data =pollTestServer();
			res.json({"message":data});
		}else{
			res.json({"message":"passing times: "+timeRange});
		}
	});

	apiRouter.route("/historical/date/:dateRange")
	.post(function(req,res){
		var dateRange = req.params.dateRange;
		console.log("filtering dates:"+dateRange);
		filterModule.addFilter('dateRange',dateRange);
		if(filterModule.isFullSet()){
			// console.log("making historical promise");
			// createHistoricalDataPromise()
			// .then(function(res){
			// 	res.json({"message":"loaded data successfully!"});
			// });
			// .catch(function(rej){
			// 	res.json({"message":rej});
			// });

			var data = pollTestServer();
			res.json({"message":data.message});
		}else{
			res.json({"message":"passing date: "+dateRange});
		}
	});

	function pollTestServer(){
		var pathWfilters = "/historical/freq:"+filterModule.getFreqFilter() +
							"-dateRange:"+filterModule.getDateRangeFilter() +
							"-timeRange:"+filterModule.getTimeRangeFilter();
		// console.log("sending query inside promise"+pathWfilters);
		var queryServer = {
			hostname:config['serverIP'],
			port:config['serverPort'],
			path:pathWfilters
		}
		var output = "";
		var request = http.get(queryServer,function(results){
			results.on('data',function(chunk){
				output += chunk;
			});

			results.on('end',function(){
				var result = JSON.parse(output);
				console.log(result);
				return result;
			});
		});
		request.on('error',function(err){
			// console.log(err);
			return err;
		});
	};

	function createHistoricalDataPromise(){
		// var loadHistoricalData = new Promise(function(resolve,reject){
		return new Promise(function(resolve,reject){
			var pathWfilters = "/historical/freq:"+filterModule.getFreqFilter() +
								"-dateRange:"+filterModule.getDateRangeFilter() +
								"-timeRange:"+filterModule.getTimeRangeFilter();
			// console.log("sending query inside promise"+pathWfilters);
			var queryServer = {
				hostname:config['serverIP'],
				port:config['serverPort'],
				path:pathWfilters
			}
			var output = "";
			var request = http.get(queryServer,function(results){
				results.on('data',function(chunk){
					output += chunk;
				});

				results.on('end',function(){
					var result = JSON.parse(output);
					// console.log(result);
					resolve(result);
				});
			});
			request.on('error',function(err){
				// console.log(err);
				reject(err);
			});
		});
	};

	return apiRouter;
};
