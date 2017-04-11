var bodyParser = require("body-parser");
var sensorModule = require("../modules/sensor");
var filterModule = require("../modules/filter");
var db = require("../modules/dbUtils");

module.exports = function(app,express,config){	
	var apiRouter = express.Router();
	db.init(config);

	apiRouter.route("/live")
	.get(function(req, res){		
		res.json({'sensors':sensors});
	})
	
	apiRouter.route("/live/sensors")
	.post(function(req,res){
		var filters = filterModule.getSensorFilters();
		console.log(filters);
		db.getSensors(filters,function(sensors){
			res.json({'sensors':sensors});
		});
	});

	apiRouter.route("/live/:sensorId")
	.post(function(req,res){
		var sensorId = req.params.sensorId;
		// console.log("sensor id: "+sensorId);
		// sensorModule.addFilter(sensorId);
		filterModule.addFilter('sensor',sensorId);
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
			res.json({"message":'message received from test sever'});
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
			res.json({"message":'message received from test sever'});
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
			res.json({"message":'message received from test sever'});
		}else{
			res.json({"message":"passing date: "+dateRange});
		}
	});

	return apiRouter;
};
