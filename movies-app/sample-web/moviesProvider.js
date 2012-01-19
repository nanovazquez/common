var AzureEndpoint = require('azureEndpoints').AzureEndpoint;
var mongoDb = require('mongodb').Db;
var mongoDbConnection = require('mongodb').Connection;
var mongoServer = require('mongodb').Server;
var bson = require('mongodb').BSONNative;
var objectID = require('mongodb').ObjectID;

var MoviesProvider = function() {
  var self = this;

  // Create mongodb azure endpoint
  // TODO: Replace 'ReplicaSetRole' with your MongoDB role name (ReplicaSetRole is the default)
  var mongoEndpoints = new AzureEndpoint('ReplicaSetRole', 'MongodPort');
  
  // Watch the endpoint for topologyChange events
  mongoEndpoints.on('topologyChange', function() {
	if (self.db) {
		self.db.close();
		self.db = null;
	}  
	var mongoDbServerConfig = mongoEndpoints.getMongoDBServerConfig();
	self.db = new mongoDb('test', mongoDbServerConfig, {native_parser:false});
	self.db.open(function() {});
  });
  
  mongoEndpoints.on('error', function(error) {  throw error;});
};

MoviesProvider.prototype.getCollection = function(callback) {
  var self = this;

  var ensureMongoDbConnection = function(callback) {
    if (self.db.state !== 'connected') {
      self.db.open(function (error, client) {
        callback(error);
      });
    } else {
      callback(null);
    }
  }

  ensureMongoDbConnection(function(error) {
    if (error) {
      callback(error);
    } else {
      self.db.collection('movies', function(error, movies_collection) {
        if (error) {
          callback(error);
        } else {
          callback(null, movies_collection);
        }
      });
    }
  });
};

MoviesProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, movies_collection) {
    if (error) {
      callback(error)
    } else {
      movies_collection.find().toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
			callback(null, results);
        }
      });
    }
  });
};

MoviesProvider.prototype.fillCollectionIfEmpty = function(callback){
	var self = this;
	self.db.createCollection('movies', function(err, collection){
		if(!err){
			collection.find().toArray(function(err, results){
				if(results.length == 0){
					var movies = new Array();
					movies.push({ 'Title':'Rocky', 'Genre':'Action', 'Date':'1976' });
					movies.push({ 'Title':'Back to the Future', 'Genre':'Science Fiction', 'Date':'1985' });
					movies.push({ 'Title':'Top Gun', 'Genre':'Action', 'Date':'1986' });
					movies.push({ 'Title':'El secreto de sus ojos', 'Genre':'Drama/Thriller', 'Date':'2009' });
					movies.push({ 'Title':'The Godfather', 'Genre':'Crime/Drama', 'Date':'1972' });
					collection.insert(movies, function(err,res){});
				}
			});
		}
		else
			callback(err);
	});
};

exports.MoviesProvider = MoviesProvider;