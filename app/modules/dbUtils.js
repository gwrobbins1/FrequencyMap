'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	// var connection = null;
	var pool = null;

	var init = function(config){
		configuration = config;
		pool = mysql.createPool({
			waitForConnections : false,
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

	var insertSensors = function(sensorArray){
		// var connection = connect();
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				// return connection;
				if(connection !== undefined){
		     	console.log("inserting sensors");
					connection.query(
						{
							sql:"INSERT INTO Sensors (SID,Latitude,Longitude) VALUES ?;",
							values:[sensorArray]
						},
						function(err,results,fields){					
							if(err){
								// console.log(err);
								console.log("Sensor are already in DB.");
							}
							else{console.log("Inserted "+results.affectedRows+" sensors into DB.");}
							close(connection);
						}
					);			
				}else{console.log("connection is undefined");}				
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
		close : close
	};
})();



module.exports = dbUtils;