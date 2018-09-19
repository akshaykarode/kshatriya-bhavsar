angular.module('reshimgathi')
.directive("sidebarCmp", [function(){
    return {
      restrict: "EA",
      scope: false,
      templateUrl: './js/components/sidebar.component.html',
      link: function(scope, el, attrs){
    	}
    };
}]);