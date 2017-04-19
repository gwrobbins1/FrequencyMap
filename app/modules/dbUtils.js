'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	var pool = null;

	var init = function(config){
		configuration = config;
		pool = mysql.createPool({
			multipleStatements : true,
			connectionLimit:100,
			host:configuration.mySqlHost,
			user:configuration.user,
			password:configuration.password,
			database:configuration.database
		});	
		console.log("Intialized DB connection");
	};

	var getSensors = function(filters, next){
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				if(connection !== undefined){
					if(filters && filters.length > 0){
						console.log(filters);
						var  query = "SELECT * from Sensors WHERE Sensors.SID NOT IN (?);";
						connection.query({
								sql:query,
								values:[filters]
							},
							function(error,res,fields){
								if(error){console.log(error);}
								else{
									close(connection);
									next(res);
								}							
							}
						);						
					}else{
						var query = "SELECT * FROM Sensors;";
						connection.query({
								sql:query
							},
							function(error,res,fields){
								if(error){console.log(error);}
								else{
									close(connection);
									next(res);
								}							
							}
						);						
					}
				}
			}
		});
	};

	var getLiveReadings = function(freq,filteredSensors,next){
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				if(filteredSensors.length === 0){
					connection.query({
							sql:"SELECT Sensors_SID,TIME,READINGS FROM Live WHERE Frequency = ?;",
							values:freq
						},
						function(err,res,fields){
							if(err){
								console.log(err);
							}else{
								close(connection);
								// console.log("res len: "+res.length);
								next(res);
							}
						}
					);
				}else{
					connection.query({
							sql:"SELECT Sensors_SID,TIME,READINGS FROM Live WHERE Frequency = ? and Sensors_SID NOT IN (?)",
							values:[freq,filteredSensors]
						},
						function(err,res,fields){
							if(err){
								console.log(err);
							}else{
								close(connection);
								next(res);
							}
						}
					);
				}
			}
		});
	};

	var getHistoricalReadings = function(freq,start,end,next){
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				connection.query({
					sql:"SELECT * FROM Recorded_data rd JOIN Sensors s on rd.Sensors_SID=s.SID WHERE TIME BETWEEN ? AND ? and Frequency = ?",
					values:[start,end,freq]
				},function(error,res,fields){
					if(error){console.log(error);}
					else{
						close(connection);
						next(res);
					}
				});
			}
		});
	};

	var getHistoricalHistogram = function(freq,start,end,next){
		var query =	"SELECT * FROM Recorded_Data rd JOIN Sensors s on "+
			"rd.Sensors_SID=s.SID WHERE TIME BETWEEN ? AND ? AND Frequency = ?;";

		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				connection.query({
					sql:query,
					values:[start,end,freq]
				},function(error,res,fields){
					if(error){console.log(error);}
					else{
						close(connection);
						next(res);
					}
				});
			}
		});
	};	

	var getLineGraph = function(freq,start,end,next){
		var query =	"SELECT * FROM Recorded_Data rd JOIN Sensors s on "+
			"rd.Sensors_SID=s.SID WHERE TIME BETWEEN ? AND ? AND Frequency = ?;";

		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				connection.query({
					sql:query,
					values:[start,end,freq]
				},function(error,res,fields){
					if(error){console.log(error);}
					else{
						close(connection);
						next(res);
					}
				});
			}
		});
	};

	var close = function(connection){
		connection.release();
		console.log("DB connection released");
	}

	return {
		init : init,
		getSensors : getSensors,
		getLiveReadings : getLiveReadings,
		getHistoricalReadings : getHistoricalReadings,
		getHistoricalHistogram : getHistoricalHistogram,
		getLineGraph : getLineGraph
	};
})();



module.exports = dbUtils;