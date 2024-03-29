/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('reshimgathi')
	.controller('appCtrl', function appCtrl($scope, $routeParams, $filter) {
		'use strict';
		$scope.appName = 'Reshimgathi';
	});
