
angular.module('reshimgathi', [
	'ngRoute', 
	'ngResource',
	'ui.router'
	])
	.config(['$stateProvider',function ($stateProvider) {
		'use strict';

		$stateProvider
    .state({
    	name:"home",
      url:'/',
      templateUrl: './js/views/home.html',
      controller: 'homeCtrl',

    })
    .state({
    	name:"signup",
      url:'/signup',
      templateUrl: './js/views/signup.html',
      controller: 'signUpCtrl',
    })
    .state({
    	name:"app",
      url:'/app',
      templateUrl: './js/views/components/app.component.html',
      controller: 'appCtrl',
    })
    .state({
    	name:"app.all",
      url:'/all',
      template: '<h3>All</h3>',
      controller: 'allCtrl',
    })

	}]);
