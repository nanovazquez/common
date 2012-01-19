module.exports = Home;

function Home (moviesProvider) {
    this.moviesProvider = moviesProvider;
};

Home.prototype = {
    showItems: function (req, res) {
		var self = this;
        this.getItems(function (error, movies) {
			if (!movies) {
			  movies = [];
			}
			self.showResults(res, movies);
		});
	},
    
	getItems: function (callback) {
		this.moviesProvider.fillCollectionIfEmpty(callback);
		this.moviesProvider.findAll(callback);
	},
	
    showResults: function (res, movies) {
        res.render('home', { 
            title: 'Movies', 
            layout: true, 
            movies: movies 
		});
    },
};