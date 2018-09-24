
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
      name:"app.matches",
      url:'/matches',
      templateUrl: './js/views/matches.html',
      controller: 'matchesCtrl',
    })
    .state({
      name:"app.profiles",
      url:'/profiles',
      templateUrl: './js/views/profiles.html',
      controller: 'profilesCtrl',
    })
    .state({
      name:"app.shortlisted",
      url:'/shortlisted',
      templateUrl: './js/views/shortlisted.html',
      controller: 'shortlistedCtrl',
    })
    .state({
    	name:"404",
      url:'/404',
      template: '<h3>404</h3>'
    })

    $urlRouterProvider.otherwise('/');

	}]);
