var imageApp = angular.module('imageApp',[]);
imageApp.directive('sbLoad', ['$parse', 'imageService', function ($parse, imageService) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      scope.setImg(elem.context);
      elem.on('load', function (event) {
        imageService.process(scope.img, scope.parameters);
      });
    }
  };
}]);

imageApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);
  
imageApp.controller('imageAppCtl',['$scope', 'imageService', 'defaultParameters', function($scope, imageService, defaultParameters) {
  $scope.parameters = defaultParameters.parameters;
  $scope.img = "";

  $scope.setImg = function(elem) {
    $scope.img = elem;
  }
  $scope.$watchGroup(defaultParameters.watchGroup, function(newValue, oldValue) {
    if (newValue !== oldValue) {
      imageService.process($scope.img, $scope.parameters);
    }
  });
}]);
  
imageApp.directive('fileSelect', function() {
  var template = '<span>You can use an image from your own computer.  This file will not be uploaded ' + 
     'It will just be processed locally<br /></span>' + 
     '<input type="file" name="files" accept="image/*">';
  return function( scope, elem, attrs ) {
    var selector = $( template );
    elem.append(selector);
    selector.bind('change', function( event ) {
      scope.img.src = URL.createObjectURL(event.target.files[0]);
    });
    scope.$watch(attrs.fileSelect, function(file) {
      selector.val(file);
    });
  };
});

imageApp.filter('displayNumber', function() {
  return function(input, digits) {
    return parseFloat(input).toFixed(digits);
  }
})