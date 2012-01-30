var azure  = require('azure');
module.exports = Home;

function obtainPropertyValue(collection, propertyName){
	var names = [];
	for(var key in collection){
		var item = collection[key];
		if (item.hasOwnProperty(propertyName))
			names.push(item[propertyName]);
	}
	return names;
}

function Home () {
	this.blobService = azure.createBlobService();
};

Home.prototype = {
    showContainers: function (req, res) {
        var self = this;
        self.blobService.listContainers(function(err, result){
			if(!err){
				var names = obtainPropertyValue(result, 'name');
				self.containers = names;
				self.showResults(res, names, []);
			}
			else
				callback(err, null);
		});
    },
	
	showBlobs: function(req, res){
		var self = this;
		var containerName = req.query['containerName'];
		if (!containerName)
			self.showContainers(req, res);
		else
			self.blobService.listBlobs(containerName, function(err, result){
				if(!err){
					var names = obtainPropertyValue(result, 'name');
					self.showResults(res, self.containers, names);
				}
				else
					callback(err, null);
			});
	},

    getContainers: function (callback) {
        var containers = [];
		callback(containers);
    },

    showResults: function (res, containers, blobs) {
        res.render('home', { 
            title: 'Azure Blob Explorer', 
            layout: true, 
            containers: containers,
			blobs: blobs});
    },
};

