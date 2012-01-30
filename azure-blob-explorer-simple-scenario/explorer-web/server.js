
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Home = require('./home');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
var home = new Home();
app.get('/', function(req, res){
	home.showContainers(req, res);
});
app.get('/showBlobs?', function(req, res){
	home.showBlobs(req, res);
});


var port = process.env.port || 81;
app.listen(port);
console.log("Server listening on port " + port);
