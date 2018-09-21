
angular.module('reshimgathi', [
	'ngRoute', 
	'ngResource',
	'ui.router'
	])
	.config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
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
      templateUrl: './js/views/components/app.component.html',
      controller: 'appCtrl',
    })
    .state({
    	name:"app.all",
      url:'/app',
      templateUrl: './js/views/all.html',
      controller: 'allCtrl',
    })
    .state({
    	name:"404",
      url:'/404',
      template: '<h3>404</h3>'
    })

    $urlRouterProvider.otherwise('/');

	}]);
