$(function () {
  var numPixels = 600 * 300;
  var canvasData = [];
  for (var i = 0; i < numPixels*4; i++) {
    canvasData.push(Math.floor(Math.random()* 256));
  }
  
  module("image");

  test("should get back a list of 'numpixels'.len", function () {
    var pixelArray = convertToPixelData(canvasData);
    console.log(pixelArray[2000]);
    ok(pixelArray.length === numPixels, 'Expected ' + numPixels + ' got ' + pixelArray.length)
  })
})
