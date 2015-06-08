'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MyrouteCtrl
 * @description
 * # MyrouteCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
 .controller('MyrouteCtrl',['$rootScope','$scope','$routeParams',function($rootScope,$scope,$routeParams){
 			repo=$scope.repos[$routeParams.id]
		}])
