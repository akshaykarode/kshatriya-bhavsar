angular.module('reshimgathi')
.controller('profilesCtrl', ['$scope','$state','$routeParams','$filter','profileService', function profilesCtrl($scope, $state, $routeParams, $filter, profileService) {
  'use strict';
  console.log("profilesCtrl")
  /* Configs */
  $scope.Profiles=[]

  /* Configs Ends*/
  $scope.viewProfile=function(profile){
    console.log("viewProfile")
    $state.go('app.profileDetails', {profile:profile});
  }
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
}])
.controller('profilesDetailsCtrl', ['$scope','$stateParams', function profilesCtrl($scope, $stateParams) {
  'use strict';
  console.log("profilesDetailsCtrl",$stateParams)
  $scope.profile=$stateParams.profile
}]);