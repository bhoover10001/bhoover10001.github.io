$(function () {
  var serviceInvoked = false;
  imageApp.service('imageService', function() { 
    this.process = function() { serviceInvoked = true};
  });
  imageApp.factory('defaultParameters', function() {
    return {
      parameters: {
        variable: 0.2126
      }, 
      watchGroup: ['parameters.variable']
    }
  });
  var injector = angular.injector(['ng', 'imageApp']);
  var $compile = injector.get('$compile');
  var iService = injector.get('imageService');
  var defaultParameters = injector.get('defaultParameters');
  var scope;
  
  var init = {
    setup: function() {
      this.$scope = injector.get('$rootScope').$new();
      var $controller = injector.get('$controller');
      $controller('imageAppCtl', {
        $scope: this.$scope
      });
    }
  };
  
  module("image", init);

  test('service injected correctly', function(){
    ok(angular.isFunction(iService.process));
  });

  test('parameter initialized', function(){
    var $controller = injector.get('$controller');
    $controller('imageAppCtl', {
      $scope: this.$scope,
      defaultParameters: defaultParameters
    });
    equal(this.$scope.parameters.variable, 0.2126, 'parameter was initialized correctly');
  });
  
  test('make sure the processing scope is invoked when a parameter is changed since there is an img', function(){
    this.$scope.img = 'imageLoaded';
    this.$scope.$digest();
    serviceInvoked = false;
    this.$scope.parameters.variable = this.$scope.parameters.variable + 1;
    this.$scope.$digest();
    ok(serviceInvoked, 'Service was invoked');
  });

  test('Check the file directive renders the correct tag', function(){
    var element = angular.element('<div file-select="file"></div>');
    $compile(element)(this.$scope);
    ok(element.html().length > 20, 'Tag was correctly rendered');
  });

  test('Check the load function is being called correctly', function( assert ){
    var element = angular.element('<img sb-load >');
    $compile(element)(this.$scope);
    serviceInvoked = false;
    element.triggerHandler($.Event('load'));
    ok(serviceInvoked, 'Tag was correctly rendered');
  });

  test('The displayNumber filter should display the correct number of decimal points', function( assert ){
    var $filter = injector.get('$filter');
    equal($filter('displayNumber')(2.457890, 4), 2.4579, 'The correct number of decimals are being displayed')
  });
})