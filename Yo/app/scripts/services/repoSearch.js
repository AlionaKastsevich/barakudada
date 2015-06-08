angular.module('yoApp')
.service('RepoSearch',function($resource,$q){
	return {
	    getInfo : function (params,cb) {
	      var response = $resource('https://api.github.com/search/repositories?q=:searchByRepos+size:<=:maxRepoSize+forks:>=:minForks+stars:>=:minStars',
	      	{
	      		searchByRepos:params.searchByRepos,
	      		maxRepoSize:params.maxRepoSize,
	      		minForks:params.minForks,
	      		minStars:params.minStars
	      	},
	        {
	        	setInfo : {method:'GET' }
	        });
	        response.setInfo(function (response){
	        	cb(response);
	      	});
	    }
  	}
})
