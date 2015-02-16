$(function () {
  
  module("Convolution Worker");

  test('test convolve with a filter of [1] and everything else basic', function(assert) {
    console.log('workers unite!' + document.URL);
    ok(true);
  })
  

  var blankImgDataForConvoluteTests = {height: 3, width: 3, data: []};
  var imgDataForGetWindowTests = {height: 3, 
      width:3, 
      data: [1, 2, 3, 10, 4, 5, 6, 20, 7, 8, 9, 30, 10, 11, 12, 40, 13, 14, 15, 50, 16, 17, 18, 60, 19, 20, 21, 70, 22, 23, 24, 80, 25, 26, 27, 90 ]};
})
