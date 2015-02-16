$(function () {
  var numPixels = 600 * 300;
  var canvasData = [];
  for (var i = 0; i < numPixels*4; i++) {
    canvasData.push(Math.floor(Math.random()* 256));
  }
  
  module("Convolution");

  test("convolution with transform array of 1 pixel should return back the same pixel", function (assert ) {
    var imgStruct = {red:[1], green: [2], blue: [3]};
    var transformArray = [1];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 1, greenSum: 2, blueSum: 3, numPixels: 1})
  })

  test("convolution with transform array of 3x3 should return the middle pixel", function (assert ) {
    var imgStruct = {red:[1, 1, 1, 1, 2, 1, 1, 1, 1], green: [1, 1, 1, 1, 5, 1, 1, 1, 1], blue: [1, 1, 1, 1, 8, 1, 1, 1, 1]};
    var transformArray = [0, 0, 0, 0, 1, 0, 0, 0, 0];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 2, greenSum: 5, blueSum: 8, numPixels: 9})
  })

  test("convolution with transform array of 3x3 and negative values should return the middle pixel", function (assert ) {
    var imgStruct = {red:[1, 1, 1, 1, 2, 1, 1, 1, 1], green: [1, 1, 1, 1, 5, 1, 1, 1, 1], blue: [1, 1, 1, 1, 8, 1, 1, 1, 1]};
    var transformArray = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 6, greenSum: 21, blueSum: 36, numPixels: 9})
  })

  test("convolution with transform array of 3x3 and undefined first row should still return the middle pixel, but a different count", function (assert ) {
    var imgStruct = {red:[, , , 1, 2, 1, 1, 1, 1], green: [, , , 1, 5, 1, 1, 1, 1], blue: [, , , 1, 8, 1, 1, 1, 1]};
    var transformArray = [0, 0, 0, 0, 1, 0, 0, 0, 0];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 2, greenSum: 5, blueSum: 8, numPixels: 6})
  })

  test("convolution with transform array of 3x3 and undefined last row should still return the middle pixel, but a different count", function (assert ) {
    var imgStruct = {red:[1, 1, 1, 1, 2, 1, , , ], green: [1, 1, 1, 1, 5, 1, , , ], blue: [1, 1, 1, 1, 8, 1, , , ]};
    var transformArray = [0, 0, 0, 0, 1, 0, 0, 0, 0];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 2, greenSum: 5, blueSum: 8, numPixels: 6})
  })

  test("convolution with transform array of 3x3 and on the edge (first or last pixel)middle pixel, but a different count", function (assert ) {
    var imgStruct = {red:[, , , , 2, 1, , 1,1], green: [, , , , 5, 1, , 1, 1], blue: [, , , , 8, 1, ,1 , 1]};
    var transformArray = [0, 0, 0, 0, 1, 0, 0, 0, 0];
    var result = convolve(imgStruct, transformArray);
    assert.deepEqual(result, {redSum: 2, greenSum: 5, blueSum: 8, numPixels: 4})
  })

  test('initializeGetSquareWindow returns a function', function(assert) {
    var result = initializeGetSquareWindow( imgDataForGetWindowTests, 3);
    ok($.isFunction(result));
  })
  
  test('initializeGetSquareWindow make sure we are getting the right result for a window of sized 3 and getting pixel at position 1,1', function(assert) {
    var windowWalker = initializeGetSquareWindow( imgDataForGetWindowTests, 3);
    var result = windowWalker(1,1);
    assert.deepEqual(result, {red: [1, 4, 7, 10, 13, 16, 19, 22, 25], green: [2, 5, 8, 11, 14, 17, 20, 23, 26], blue: [3, 6, 9, 12, 15, 18, 21, 24, 27]})
  })
  
  test('initializeGetSquareWindow make sure we are getting the right result for a window of sized 3 and getting pixel at position 0,0', function(assert) {
    var windowWalker = initializeGetSquareWindow( imgDataForGetWindowTests, 3);
    var result = windowWalker(0,0);
    assert.deepEqual(result, {red: [, , , , 1, 4, , 10, 13], green: [, , , , 2, 5, , 11, 14], blue: [, , , , 3, 6, , 12, 15]})
  })
  
  test('initializeGetSquareWindow make sure we are getting the right result for a window of sized 1 and getting pixel at position 1,1', function(assert) {
    var windowWalker = initializeGetSquareWindow( imgDataForGetWindowTests, 1);
    var result = windowWalker(1,1);
    assert.deepEqual(result, {red: [13], green: [14], blue: [15]})
  })
  
  test('test convolve with a filter of [1] and everything else basic', function(assert) {
    var result = convolute(imgDataForGetWindowTests, blankImgDataForConvoluteTests, [1], 0);
    assert.deepEqual(result,imgDataForGetWindowTests);
  })
  
  test('test convolve with a filter of [1] and height = 2, with a startY of 1', function(assert) {
    var tempCanvas = {height: 2, width: 3, data: []};
    var result = convolute(imgDataForGetWindowTests, tempCanvas, [1], 1);
    var expectedResult = {height: 2, 
          width:3, 
          data: [10, 11, 12, 40, 13, 14, 15, 50, 16, 17, 18, 60, 19, 20, 21, 70, 22, 23, 24, 80, 25, 26, 27, 90 ]};
    assert.deepEqual(result,expectedResult);
  })
  
  test('test convolve with a filter of [1] and height = 2, with a startY of 1', function(assert) {
    var tempCanvas = {height: 2, width: 3, data: []};
    var result = convolute(imgDataForGetWindowTests, tempCanvas, [1], 1);
    var expectedResult = {height: 2, 
          width:3, 
          data: [10, 11, 12, 40, 13, 14, 15, 50, 16, 17, 18, 60, 19, 20, 21, 70, 22, 23, 24, 80, 25, 26, 27, 90 ]};
    assert.deepEqual(result,expectedResult);
  })
  
  test('test convolve with sharpen filter and everything else basic', function(assert) {
    var result = convolute(imgDataForGetWindowTests, blankImgDataForConvoluteTests, [0, -1, 0, -1, 5, -1, 0, -1, 0], 0);
    assert.deepEqual(result,imgDataForGetWindowTests);
  })

  var blankImgDataForConvoluteTests = {height: 3, width: 3, data: []};
  var imgDataForGetWindowTests = {height: 3, 
      width:3, 
      data: [1, 2, 3, 10, 4, 5, 6, 20, 7, 8, 9, 30, 10, 11, 12, 40, 13, 14, 15, 50, 16, 17, 18, 60, 19, 20, 21, 70, 22, 23, 24, 80, 25, 26, 27, 90 ]};
})
