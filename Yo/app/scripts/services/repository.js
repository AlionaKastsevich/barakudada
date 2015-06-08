angular.module('yoApp')
.service('Repository',function($resource){
	return $resource('https://api.github.com/repos/:login/:name/:param',{login:'@login',name:'@name',param:"@param"});
})

   
  