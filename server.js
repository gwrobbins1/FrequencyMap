var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );

app.use(morgan("dev"));

var config = {};
fs.readFile('./config.properties','utf8',function(err,data){
	if(err){console.log(err);}
	data.split('\n').forEach(function(line){
		if(line.charAt(0) !== '#'){
			var strArray = line.split(':');
			if(strArray[0] !== '' && strArray[1]){
				config[strArray[0]] = strArray[1];
			}
		}
	});
	app.use("/",express.static(path.join(__dirname,"/public")) );
	var apiRouter = require("./app/routes/api")(app,express,config);
	app.use("/api", apiRouter);
	app.get("*",function(req,res){
		res.sendFile(path.join(__dirname+"/public/index.html"));
	});

	var port = parseInt(config['port']);
	app.listen( port );
	console.log("server started on port: "+port);
});