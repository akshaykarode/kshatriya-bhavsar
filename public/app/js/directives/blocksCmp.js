angular.module('reshimgathi')
.directive("sidebarCmp", [function(){
    return {
      restrict: "EA",
      scope: false,
      templateUrl: './js/views/components/sidebar.component.html',
      link: function(scope, el, attrs){
    	}
    };
}])
.directive("navbarCmp", [function(){
    return {
      restrict: "EA",
      scope: false,
      templateUrl: './js/views/components/navbar.component.html',
      link: function(scope, el, attrs){
    	}
    };
}])
.directive("footerCmp", [function(){
    return {
      restrict: "EA",
      scope: false,
      templateUrl: './js/views/components/footer.component.html',
      link: function(scope, el, attrs){
    	}
    };
}])
