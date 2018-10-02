angular.module('reshimgathi')
.controller('profilesCtrl', ['$scope','$routeParams','$filter','profileService', function profilesCtrl($scope, $routeParams, $filter, profileService) {
  'use strict';
  console.log("profilesCtrl")
  /* Configs */
  $scope.Profiles=[]
  /* Configs Ends*/
  $scope.init = function() {
    $scope.loading = true
    profileService.getProfiles({})
    .then(function(Profiles) { // Success callback
    	$scope.loading = false
      $scope.Profiles = _.cloneDeep(Profiles)
      console.debug('Profiles', $scope.Profiles)
    }, function(reason) { // Error callback
      console.debug('Fail', reason)
    });
  }
  $scope.init()
}]);