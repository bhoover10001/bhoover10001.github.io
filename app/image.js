function setToCanvas(image, canvas) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  getContext(canvas).drawImage(image, 0, 0);
}

function calculateHistogram(canvas) {
  var pixels = getContext(canvas).getImageData(0,0, canvas.width, canvas.height).data
  var red = new Uint32Array(256);
  var green = new Uint32Array(256);
  var blue = new Uint32Array(256);
  var alpha = new Uint32Array(256);
  var grey = new Uint32Array(256);
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red[pixels[i]] +=1;
    green[pixels[i+1]] +=1;
    blue[pixels[i+2]] +=1;
    alpha[pixels[i+3]] += 1;
    grey[Math.floor((pixels[i] + pixels[i+1] + pixels[i+2]) /3)] += 1;
  }
  return {red: red, green: green, blue: blue, grey: grey, alpha: alpha};
}

function getContext(canvas) {
	return canvas.getContext('2d');
}

function convertToGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var red, green, blue, grey;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red = pixels[i];
    green = pixels[i+1];
    blue = pixels[i+2];
    grey = Math.floor((red + green + blue) /3);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = grey;
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function equalizeGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var greyScalePixels = calculateHistogram(canvas).grey;
  var numPixels = canvas.width * canvas.height;
  var conversion = calculateEqualization(greyScalePixels, numPixels);
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red = pixels[i];
    green = pixels[i+1];
    blue = pixels[i+2];
    grey = Math.floor((red + green + blue) /3);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = conversion[grey];
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function calculateEqualization(greyScalePixels, numPixels) {
  var cdf = 0;
  var p = [];
  for (var i = 0; i < 256; i+= 1) {
    cdf += greyScalePixels[i];
    p[i] = Math.floor((cdf - greyScalePixels[0]) * 255 / (numPixels- greyScalePixels[0]));
  }
  return p;
}

function localMeansGreyScale(canvas, blockSize) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  greyScaleFilter(map.data, canvas.height, canvas.width, blockSize, mean);
  getContext(canvas).putImageData(map, 0, 0);
}

function medianFilterGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  greyScaleFilter(map.data, canvas.height, canvas.width, 3, median);
  getContext(canvas).putImageData(map, 0, 0);
}

function laPlaceFilterGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  greyScaleFilter(map.data, canvas.height, canvas.width, 3, laPlace);
  getContext(canvas).putImageData(map, 0, 0);
}

function sharpenFilterGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  greyScaleFilter(map.data, canvas.height, canvas.width, 3, sharpen);
  getContext(canvas).putImageData(map, 0, 0);
}

function greyScaleFilter(data, canvas_height, canvas_width, windowWidth, filterFunction) {
  var window = Math.floor(windowWidth/ 2);
  var localData = makeDefensiveCopy(data);
  if (window <= 0) {
    return;
  }
  for (var y = 0; y < canvas_height; y += 1) {
    for (var x = 0; x < canvas_width; x += 1) {
      var startY = Math.max(0, y - window);
      var startX = Math.max(0, x - window);
      var endY = Math.min(canvas_height -1, y + window);
      var endX = Math.min(canvas_width -1, x + window);
      var greyScalePixels = [];
      for (var y1 = startY; y1 <= endY; y1 += 1) {
        for (var x1 = startX; x1 <= endX; x1 +=1) {
          var location = (y1 * canvas_width * 4) + x1 * 4;
          greyScalePixels.push(localData[location]);
        }
      }
      setGreyPixels(data, currentPixelArrayLocation(y, x, canvas_width), filterFunction(greyScalePixels));
    }
  }
}

function makeDefensiveCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

function setGreyPixels(pixels, arrayLocation, value) {
  pixels[arrayLocation] = pixels[arrayLocation + 1] = pixels[arrayLocation + 2] = value;
}

/**
 * Assumes the passed in pixel array is 9 long.
 */
var laPlace = function(pixelArray) {
  return pixelArray[1] + pixelArray[3] + pixelArray[5] + pixelArray[7] - 4 * pixelArray[4]
}

/**
 * Assumes the passed in pixel array is 9 long.
 */
var sharpen = function(pixelArray) {
  return 5*pixelArray[4] - pixelArray[1] - pixelArray[3] - pixelArray[5] - pixelArray[7];
}

var mean = function(pixelArray) {
  var total = pixelArray.reduce(function(a,b) {return a+b});
  return Math.floor(total/pixelArray.length);
}

var median = function(pixelArray) {
  pixelArray.sort(function(a,b) {return a - b;});
  var half = Math.floor(pixelArray.length/2);
  if (pixelArray.length % 2) {
    return pixelArray[half];
  }
  return pixelArray[half-1];
}

/**
 * Generates a random noise, with a density, that really the probability that any 
 * pixel is noisy.  This adds the exact same noise to all the RGB channels, hence the "greyScale" label.
 * Density should be between 0 and 1.
 * @param canvas
 * @param density
 */
function greyScaleWhiteNoiseGenerator(canvas, density) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  for (var y = 0; y < canvas.height; y += 1) {
    for (var x = 0; x < canvas.width; x += 1) {
      if (Math.random() > density) {
        continue;
      }
      var noise = Math.floor(Math.random() * 256);
      var currentRedPixel = currentPixelArrayLocation(y, x, canvas.width);
      pixels[currentRedPixel] = pixels[currentRedPixel + 1] = pixels[currentRedPixel + 2] = (pixels[currentRedPixel] + noise) % 256;
    }
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function currentPixelArrayLocation(y, x, imageWidth) {
  return (y * imageWidth * 4) + x * 4;
}

var PixelData = function(red, green, blue, alpha) {
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.alpha = alpha;
}

PixelData.prototype.convertToHSL = function() {
  this.hue = this.red + this.green + this.blue;
  this.saturation = this.red + this.green + this.blue;
  this.level = this.red + this.green + this.blue;
}

function convertToPixelData(data) {
  var pixelArray = [];
  var len = data.length;
  for (var i = 0; i < len; i += 4) {
    pixelArray.push(new PixelData(data[i], data[i+1], data[i+3], data[i+4]));
  }
  return pixelArray;
}