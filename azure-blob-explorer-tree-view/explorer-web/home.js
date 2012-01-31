var azure  = require('azure');
module.exports = Home;


function getChildsPath(fullPath){
	fullPath.shift();
	return fullPath.toString().replace(/,/g, '/');
}

function getFiles(collection){
	var items = [];
	for(var key in collection){
		var item = collection[key];
		var itemName = item.name.split('/')[item.name.split('/').length - 1];
		items.push({
			'text': itemName,
			'classes': 'file'
		});
	}
	return items;
}

function getFolders(containerName, collection){
	var items = [];
	if (collection && !collection.length){
		temp = collection;
		collection = [];
		collection.push(temp);
	}
	for(var key in collection){
		var item = collection[key];
		var itemName = item.Name.replace(/\/$/, '').split('/')[item.Name.replace(/\/$/, '').split('/').length - 1];
		items.push({
			'id': containerName + '/' + item.Name,
			'text': itemName,
			'expanded': false,
			'hasChildren': true,
			'classes': 'folder' 
		});
	}
	return items;
}

function getContainers(collection){
	var items = [];
	for(var key in collection){
		var item = collection[key];
		items.push({
			'id': item.name,
			'text': item.name,
			'expanded': false,
			'hasChildren': true,
			'classes': 'folder' 
		});
	}
	return items;
}

function Home () {
	this.blobService = azure.createBlobService();
};

Home.prototype = {
    
	getChilds: function(req,res){
		var self = this;
		var containerName = req.query['root'];
		
		if (!containerName || containerName == 'source')
			self.listContainers(function(err, result){
				if (!err)
					res.send(result);
				else
					console.log(err);
			});
		else{
			var path = req.query['root'].split('/');
			containerName = path[0];
			var prefix = getChildsPath(path);
			var delimiter = '/';
			
			self.listBlobs(containerName, prefix, delimiter, function(err, result){
				if (!err)
					res.send(result);
				else
					console.log(err);
			});
		}
	},
	
	listContainers: function (callback) {
        var self = this;
        self.blobService.listContainers(function(err, result){
			if(!err){
				var items = getContainers(result);
				callback(null, items);
			}
			else
				callback(err, null);
		});
    },
	
	listBlobs: function(containerName, prefix, delimiter, callback){
		var self = this;
		self.blobService.listBlobs(containerName,{ 'prefix': prefix, 'delimiter': delimiter} , function(err, result, resultCont, response){
			if(!err){
				var files = getFiles(result);
				var folders = getFolders(containerName, response.body.Blobs.BlobPrefix);
				var childs = folders.concat(files);
				callback(null, childs);
			}
			else
				callback(err, null);
			});
	},

    showHome: function (res) {
        res.render('home', { 
            title: 'Azure Blob Explorer', 
            layout: true});
    },
};