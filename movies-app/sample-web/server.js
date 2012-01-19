// Modules
var express = require('express')
  , routes = require('./routes')
var http = require('http');

var app = module.exports = express.createServer();

// Controllers
var Home = require('./home');
var MoviesProvider = require('./moviesProvider').MoviesProvider;

var moviesProvider = new MoviesProvider();
var home = new Home(moviesProvider);


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
app.get('/', home.showItems.bind(home));
app.get('/home', home.showItems.bind(home));

var port = process.env.port || 1337;
app.listen(port);