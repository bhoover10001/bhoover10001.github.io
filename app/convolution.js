function convolute(canvasData, tempCanvasData, filter, startY) {
  var y, x, location, window, newValue;
  var windowOffset = Math.ceil(Math.sqrt(filter.length) /2);
  var width = canvasData.width;
  var windowWalker = initializeGetSquareWindow(canvasData, Math.sqrt(filter.length));
  var height = tempCanvasData.height;
  var d = tempCanvasData.data;
  for (y = 0; y < height; y ++) {
    for (x = 0; x < width; x++) {
      location = y * width * 4 + x * 4;
      window = windowWalker(y + startY, x);
      newValue = convolve(window, filter);
      d[location] = newValue.redSum / newValue.numPixels;
      d[location + 1] = newValue.greenSum / newValue.numPixels;
      d[location + 2] = newValue.blueSum / newValue.numPixels;
      d[location + 3] = canvasData.data[(y + startY) * width * 4 + x * 4 + 3];
    }
  }
  return tempCanvasData;
}

function median(canvasData, tempCanvasData) {
  var y, x, location, newValue;
  var window = 1;
  var width = canvasData.width;
  var height = tempCanvasData.height;
  var originalData = canvasData.data;
  var d = tempCanvasData.data;
  for (y = 0; y < height; y ++) {
    for (x = 0; x < width; x++) {
      var startY = Math.max(0, y - window);
      var startX = Math.max(0, x - window);
      var endY = Math.min(height -1, y + window);
      var endX = Math.min(width-1, x + window);
      var redPixels = [];
      var bluePixels = [];
      var greenPixels = [];
      var originalLocation = (y * width * 4) + x * 4;
      for (var y1 = startY; y1 <= endY; y1 += 1) {
        for (var x1 = startX; x1 <= endX; x1 +=1) {
          var location = (y1 * width * 4) + x1 * 4;
          redPixels.push(originalData[location]);
          greenPixels.push(originalData[location + 1]);
          bluePixels.push(originalData[location + 2]);
        }
      }
      d[originalLocation] = getMedianValue(redPixels);
      d[originalLocation + 1] = getMedianValue(greenPixels);
      d[originalLocation + 2] = getMedianValue(bluePixels);
      d[originalLocation + 3] = originalData[originalLocation + 3];
    }
  }
  return tempCanvasData;
}

var getMedianValue = function(pixelArray) {
  pixelArray.sort(function(a,b) {return a - b;});
  var half = Math.floor(pixelArray.length/2);
  if (pixelArray.length % 2) {
    return pixelArray[half];
  }
  return pixelArray[half-1];
}

/**
 * loads the image data into a routine that can then walk down the array, for a 
 * moving window.  Eventually, this could be more optimized to keep information about
 * the window.
 * @param imgData
 * @param windowSize
 * @returns {Function}
 */
function initializeGetSquareWindow( imgData, windowSize ) {
  var height = imgData.height;
  var width = imgData.width;
  var windowOffset = Math.floor(windowSize /2);
  var lastWindow, lastX, lastY;

  return function(y, x) {
    var returnArrayRed = [];
    var returnArrayGreen = [];
    var returnArrayBlue = [];
    var startY = y - windowOffset;
    var startX = x - windowOffset;
    var endY = y + windowOffset;
    var endX = x + windowOffset;
  
    var location;
    var arrayLocation;
    for (var y1 = startY; y1 <= endY; y1++ ) {
      if (y1 < 0 || y1 >= imgData.height) {
        continue;
      }
      for (var x1 = startX; x1 <= endX; x1++) {
        if (x1 < 0 || x1 >= imgData.width) {
          continue;
        }
        location = y1 * imgData.width * 4 + x1*4;
        arrayLocation = (y1 - startY) * windowSize  + (x1- startX);
        returnArrayRed[arrayLocation ] = imgData.data[location];
        returnArrayGreen[arrayLocation] = imgData.data[location + 1];
        returnArrayBlue[arrayLocation] = imgData.data[location + 2];
      }
    }
    return {red: returnArrayRed, green: returnArrayGreen, blue: returnArrayBlue} ;
  }
}


/**
 * return the sum result, and the number of pixels that were affected (for edge conditions)
 * @param imgArray
 * @param transformArray
 */
function convolve(imgsStruct, transformArray) {
  var redSum = 0;
  var greenSum = 0;
  var blueSum = 0;
  var numPixels = 0;
  var length = transformArray.length;
  
  for (var y = 0; y < length; y++) {
    if (typeof imgsStruct.red[y] === 'undefined') {
      continue;
    }
    redSum += imgsStruct.red[y] * transformArray[y];
    greenSum += imgsStruct.green[y] * transformArray[y];
    blueSum += imgsStruct.blue[y] * transformArray[y];
    numPixels ++;
  }
  return {redSum: redSum, greenSum: greenSum, blueSum: blueSum, numPixels: numPixels};
}