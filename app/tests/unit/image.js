$(function () {
  var numPixels = 600 * 300;
  var canvasData = [];
  for (var i = 0; i < numPixels*4; i++) {
    canvasData.push(Math.floor(Math.random()* 256));
  }
  
  module("image");

  test("grey should be average of rgb", function () {
    var pixel = new PixelData(2, 3, 4);
    ok(pixel.grey() === 3, 'Expected grey to be 3 got ' + pixel.grey())
  })

  test("guassian random number generator should generate approximatly the correct average and std dev", function () {
    var maxIterations = 10000;
    var stdDev = 30;
    var mean = 128;
    var i;
    var distribution = new Uint32Array(256);
    for (i = 0; i < maxIterations; i++) {
      distribution[rnd(mean, stdDev)] ++;
    }
    var calcMean = 0;
    var n = 0;
    for (i = 0; i < 256; i ++) {
      calcMean += i * distribution[i];
      n += distribution[i];
    }
    calcMean = calcMean/n;
    var calcStdDev = 0;
    for (i = 0; i < 256; i ++) {
      calcStdDev += Math.pow(i - calcMean, 2)*distribution[i] / n;
    }
    calcStdDev = Math.sqrt(calcStdDev);
    ok(mean - 1 <= calcMean && mean + 1 >= calcMean, 'Expected mean to be ' + mean + ' but it was ' + calcMean);
    ok(stdDev - 1 <= calcStdDev && stdDev + 1 >= calcStdDev, 'Expected stdDev to be ' + stdDev + ' but it was ' + calcStdDev);
  })

  test("testing the filter", function( assert ) {
    var done = assert.async();
    var img = document.createElement('img');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 3,
    canvas.height = 2;
    img.addEventListener("load", function() {
      ctx.drawImage(img, 0, 0);
      ok(ctx.getImageData(0,0,1,1).data[0] === 255, 'Expected red-pixel to be 255, actually is ' + ctx.getImageData(0,0,1,1).data[0]);
      done();
    })
    // this is a 3x2 image
    img.src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAIAAAASFvFNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wIFDScubGmL8QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAG0lEQVQI1wXBAQ0AAAwCINz7hzKZhwzDLjTaPDVzBUhAyQZRAAAAAElFTkSuQmCC";
  })
  
  test("testing grey scale", function() {
    var canvas = document.createElement('canvas');
    var img = canvas.getContext('2d').createImageData(1, 1);
    img.data[0] = 100;
    img.data[1] = 150;
    img.data[2] = 200;
    var result = Filters.greyscale(img, [0.2126, 0.7152, 0.0722]);
    ok(result.data[0] === 142, 'Expected red-pixel to be 142, actually is ' + result.data[0])
  })
  
  test("testing Hisogram", function(assert) {
    var canvas = document.createElement('canvas');
    var img = canvas.getContext('2d').createImageData(1, 2);
    img.data[0] = 100;
    img.data[1] = 150;
    img.data[2] = 200;
    img.data[4] = 100;
    img.data[5] = 200;
    img.data[6] = 100;
    var result = Filters.histogram(img, [0.2126, 0.7152, 0.0722]);
    var expectedRedArray = new Uint32Array(256);
    var expectedGreenArray = new Uint32Array(256);
    var expectedBlueArray = new Uint32Array(256);
    var expectedGreyArray = new Uint32Array(256);
    expectedRedArray[100] = 2;
    expectedGreenArray[150] = 1;
    expectedGreenArray[200] = 1;
    expectedBlueArray[200] = 1;
    expectedBlueArray[100] = 1;
    expectedGreyArray[142] = 1;
    expectedGreyArray[171] = 1;
    assert.deepEqual(result, {red: expectedRedArray, green: expectedGreenArray, blue: expectedBlueArray, grey: expectedGreyArray});
  })

  test("testing equalize grey scale", function() {
    var canvas = document.createElement('canvas');
    var img = canvas.getContext('2d').createImageData(2, 3);
    img.data[0] = 100;
    img.data[1] = 100;
    img.data[2] = 100;
    img.data[4] = 200;
    img.data[5] = 200;
    img.data[6] = 200;
    img.data[8] = 200;
    img.data[9] = 200;
    img.data[10] = 50;
    img.data[12] = 50;
    img.data[13] = 50;
    var result = Filters.equalizeGreyScale(img);
    var expectedResult = [];
    expectedResult[0] = expectedResult[1] = expectedResult[2]  = 127;
    expectedResult[3] = expectedResult[7] = expectedResult[11] = 0;
    expectedResult[4] = expectedResult[5] = expectedResult[6]  = 255;
    expectedResult[8] = expectedResult[9] = expectedResult[10]  = 191;
    expectedResult[12] = expectedResult[13] = expectedResult[14]  = 63;
    for (var i = 0; i < 13; i++) {
     equal(result.data[i],expectedResult[i], 'equalized result correct for ' + i);
   }
  })

  var imgDataForGetWindowTests = {height: 3, 
      width:3, 
      data: [1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9, 0, 10, 11, 12, 0, 13, 14, 15, 0, 16, 17, 18, 0, 19, 20, 21, 0, 22, 23, 24, 0, 25, 26, 27, 0 ]};
})

