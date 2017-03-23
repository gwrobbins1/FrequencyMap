var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var morgan = require("morgan");

// var config = require("config");

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );

app.use(morgan("dev"));

app.use("/",express.static(path.join(__dirname,"/public")) );
var apiRouter = require("./app/routes/api")(app,express);
app.use("/api", apiRouter);
app.get("*",function(req,res){
	res.sendFile(path.join(__dirname+"/public/views/index.html"));
});
// app.listen( config.port );
// console.log("server started on port:%d", config.port);
app.listen( 8000 );
console.log("server started on local host:8000");